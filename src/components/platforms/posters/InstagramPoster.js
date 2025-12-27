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

if (!res.body) {
  throw new Error("Streaming not supported by browser");
}

const reader = res.body.getReader();
const decoder = new TextDecoder("utf-8");
let buffer = "";

// ✅ must be outside loop
let published = false;

while (true) {
  const { value, done } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });

  const parts = buffer.split("\n\n");
  buffer = parts.pop() || "";

  for (const part of parts) {
    if (!part.startsWith("data:")) continue;

    const json = part.slice(5).trim(); // remove "data:"
    const msg = JSON.parse(json);

    // Show each step in UI
    addStep("instagram", name, {
      step: msg.step,
      status: msg.status,
      error: msg.error || null
    });

    // Publish success
    if (msg.step === "publish" && msg.status === "success") {
      published = true;
      setPostSummary(prev => [...prev, { platform: "Instagram", target: name }]);
    }

    // Hard fail from server
    if (msg.step === "fatal") {
      throw new Error(msg.error || "Instagram fatal error");
    }

    // Step error
    if (msg.status === "error") {
      throw new Error(msg.error || "Instagram failed");
    }

    // Done
    if (msg.step === "done") {
      // wait for stream to finish
    }
  }
}

if (!published) {
  throw new Error("Instagram post failed (not published)");
}

addStep("instagram", name, "success");
