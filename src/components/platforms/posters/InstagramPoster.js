// InstagramPoster.js - Enhanced with detailed logging

export async function postToInstagram({
  file,
  content,
  igId,
  igAccounts,
  addStep,
  setPostSummary
}) {
  const account = igAccounts.find(a => a.ig_id === igId);
  const name = account ? `@${account.username}` : "Instagram";
  addStep("instagram", name, "pending");
  
  try {
    // ========================================
    // 🔍 DETAILED FILE INSPECTION
    // ========================================
    console.group("📋 FILE DETAILS - BEFORE UPLOAD");
    console.log("File Object:", file);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Basic file info
    console.log("📁 Basic Info:");
    console.log("  • Name:", file.name);
    console.log("  • Size:", `${(file.size / 1024).toFixed(2)} KB (${file.size} bytes)`);
    console.log("  • Type:", file.type);
    console.log("  • MIME Type:", file.type);
    console.log("  • Last Modified:", new Date(file.lastModified).toISOString());
    
    // Check if it's video or image
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    console.log("  • Media Type:", isVideo ? "VIDEO" : isImage ? "IMAGE" : "UNKNOWN");
    
    // Get file extension
    const extension = file.name.split('.').pop().toLowerCase();
    console.log("  • Extension:", extension);
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Get image/video dimensions and metadata
    if (isImage) {
      console.log("🖼️ Image Metadata:");
      try {
        const dimensions = await getImageDimensions(file);
        console.log("  • Width:", dimensions.width, "px");
        console.log("  • Height:", dimensions.height, "px");
        console.log("  • Aspect Ratio:", (dimensions.width / dimensions.height).toFixed(2), ":1");
        console.log("  • Resolution:", `${dimensions.width}x${dimensions.height}`);
        
        // Check Instagram image requirements
        const aspectRatio = dimensions.width / dimensions.height;
        const validAspectRatio = aspectRatio >= 0.8 && aspectRatio <= 1.91;
        const validResolution = dimensions.width >= 320 && dimensions.height >= 320;
        
        console.log("  • Valid Aspect Ratio (0.8-1.91):", validAspectRatio ? "✅" : "❌");
        console.log("  • Valid Resolution (min 320px):", validResolution ? "✅" : "❌");
      } catch (err) {
        console.error("  • Error getting image dimensions:", err.message);
      }
    }
    
    if (isVideo) {
      console.log("🎥 Video Metadata:");
      try {
        const videoInfo = await getVideoInfo(file);
        console.log("  • Width:", videoInfo.width, "px");
        console.log("  • Height:", videoInfo.height, "px");
        console.log("  • Duration:", videoInfo.duration.toFixed(2), "seconds");
        console.log("  • Aspect Ratio:", (videoInfo.width / videoInfo.height).toFixed(2), ":1");
        console.log("  • Resolution:", `${videoInfo.width}x${videoInfo.height}`);
        
        // Check Instagram Reels requirements
        const aspectRatio = videoInfo.width / videoInfo.height;
        const validDuration = videoInfo.duration >= 3 && videoInfo.duration <= 90;
        const validResolution = videoInfo.width >= 540 && videoInfo.height >= 960;
        const validAspectRatio = aspectRatio >= 0.8 && aspectRatio <= 1;
        
        console.log("  • Valid Duration (3-90s):", validDuration ? "✅" : "❌");
        console.log("  • Valid Resolution (540x960):", validResolution ? "✅" : "❌");
        console.log("  • Valid Aspect Ratio (0.8-1):", validAspectRatio ? "✅" : "❌");
      } catch (err) {
        console.error("  • Error getting video info:", err.message);
      }
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // File size validation
    const maxSizeVideo = 100 * 1024 * 1024; // 100MB
    const maxSizeImage = 8 * 1024 * 1024;   // 8MB
    const maxSize = isVideo ? maxSizeVideo : maxSizeImage;
    const validSize = file.size <= maxSize;
    
    console.log("💾 Size Validation:");
    console.log("  • Max Size:", isVideo ? "100 MB" : "8 MB");
    console.log("  • Current Size:", `${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log("  • Valid Size:", validSize ? "✅" : "❌");
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Caption info
    console.log("📝 Caption Info:");
    console.log("  • Length:", content.length, "characters");
    console.log("  • Has Content:", content.length > 0 ? "✅" : "❌");
    console.log("  • Preview:", content.substring(0, 50) + (content.length > 50 ? "..." : ""));
    
    console.groupEnd();
    
    // ========================================
    // 📤 UPLOAD TO SERVER
    // ========================================
    const form = new FormData();
    form.append("file", file);
    form.append("caption", content);
    form.append("igId", igId);
    
    console.group("📤 UPLOADING TO SERVER");
    console.log("Endpoint:", "/auth/instagram/media");
    console.log("Method:", "POST");
    console.log("Instagram ID:", igId);
    console.log("Account:", name);
    console.groupEnd();
    
    const startTime = Date.now();
    const res = await fetch("/auth/instagram/media", {
      method: "POST",
      body: form,
      credentials: "include"
    });
    const uploadTime = Date.now() - startTime;
    
    const data = await res.json();
    
    // ========================================
    // 📥 BACKEND RESPONSE ANALYSIS
    // ========================================
    console.group("📥 BACKEND RESPONSE");
    console.log("Upload Time:", `${uploadTime}ms`);
    console.log("Status Code:", res.status);
    console.log("Status Text:", res.statusText);
    console.log("Success:", data.success);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (data.steps) {
      console.log("📊 PROCESSING STEPS:");
      
      // Token step
      if (data.steps.token) {
        console.log("  1️⃣ Token:", data.steps.token.success ? "✅" : "❌");
        if (!data.steps.token.success) {
          console.error("     Error:", data.steps.token.error);
        }
      }
      
      // File step
      if (data.steps.file) {
        console.log("  2️⃣ File Upload:", data.steps.file.success ? "✅" : "❌");
        if (data.steps.file.success) {
          console.log("     • Filename:", data.steps.file.filename);
          console.log("     • URL:", data.steps.file.url);
          console.log("     • Type:", data.steps.file.type);
          console.log("     • Size:", data.steps.file.size ? `${(data.steps.file.size / 1024).toFixed(2)} KB` : "N/A");
        } else {
          console.error("     Error:", data.steps.file.error);
        }
      }
      
      // URL Test step
      if (data.steps.urlTest) {
        console.log("  3️⃣ URL Accessibility:", data.steps.urlTest.success ? "✅" : "❌");
        console.log("     • URL:", data.steps.urlTest.url);
        console.log("     • Status Code:", data.steps.urlTest.statusCode);
        console.log("     • Message:", data.steps.urlTest.message);
        if (!data.steps.urlTest.success) {
          console.error("     ⚠️ Instagram cannot fetch from this URL!");
          console.error("     Error:", data.steps.urlTest.error);
        }
      }
      
      // Container step
      if (data.steps.container) {
        console.log("  4️⃣ Instagram Container:", data.steps.container.success ? "✅" : "❌");
        if (data.steps.container.success) {
          console.log("     • Creation ID:", data.steps.container.creationId);
        } else {
          console.error("     Error Response:", data.steps.container.response);
          if (data.steps.container.response?.error) {
            console.error("     • Error Code:", data.steps.container.response.error.code);
            console.error("     • Error Message:", data.steps.container.response.error.message);
            console.error("     • Error Type:", data.steps.container.response.error.type);
            if (data.steps.container.response.error.error_user_msg) {
              console.error("     • User Message:", data.steps.container.response.error.error_user_msg);
            }
          }
        }
      }
      
      // Processing steps
      if (data.steps.processing && data.steps.processing.length > 0) {
        console.log("  5️⃣ Instagram Processing:", "⏳");
        data.steps.processing.forEach((proc, i) => {
          console.log(`     [${i + 1}] ${proc.time}:`, proc.status);
          if (proc.error) console.error("       Error:", proc.error);
        });
      }
      
      // Publish step
      if (data.steps.publish) {
        console.log("  6️⃣ Instagram Publish:", data.steps.publish.success ? "✅" : "❌");
        if (data.steps.publish.success) {
          console.log("     • Media ID:", data.steps.publish.mediaId);
          console.log("     🎉 Successfully posted to Instagram!");
        } else {
          console.error("     Error Response:", data.steps.publish.response);
        }
      }
      
      // Cleanup step
      if (data.steps.cleanup) {
        console.log("  7️⃣ Cleanup:", data.steps.cleanup.success ? "✅" : "❌");
        if (data.steps.cleanup.note) {
          console.log("     Note:", data.steps.cleanup.note);
        }
      }
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (data.error) {
      console.error("❌ ERROR:", data.error);
    }
    
    console.groupEnd();
    
    // ========================================
    // ✅ SUCCESS OR ERROR HANDLING
    // ========================================
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Instagram post failed");
    }
    
    addStep("instagram", name, "success");
    setPostSummary(prev => [
      ...prev,
      { platform: "Instagram", target: name }
    ]);
    
  } catch (err) {
    console.group("❌ INSTAGRAM POST ERROR");
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    console.groupEnd();
    
    addStep("instagram", name, "error");
    throw err;
  }
}

// Helper function to get image dimensions
const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    
    img.src = url;
  });
};

// Helper function to get video info
const getVideoInfo = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video"));
    };
    
    video.src = url;
  });
};