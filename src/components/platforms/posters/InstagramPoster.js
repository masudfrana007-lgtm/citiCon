// InstagramPoster.js - Enhanced with detailed logging

// ===============================
// 🧩 Helpers (REQUIRED)
// ===============================
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

function getVideoInfo(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };

    video.src = url;
  });
}

// ===============================
// 🚀 Main Poster Function
// ===============================
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
    // 🔍 FILE INSPECTION
    // ========================================
    console.group("📋 FILE DETAILS - BEFORE UPLOAD");
    console.log("File Object:", file);

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    console.log("Type:", isVideo ? "VIDEO" : isImage ? "IMAGE" : "UNKNOWN");
    console.log("Size:", `${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log("MIME:", file.type);

    if (isImage) {
      const d = await getImageDimensions(file);
      console.log("Image:", d.width, "x", d.height);
    }

    if (isVideo) {
      const v = await getVideoInfo(file);
      console.log("Video:", v.width, "x", v.height, "Duration:", v.duration);
    }

    console.groupEnd();

    // ========================================
    // 📤 UPLOAD
    // ========================================
    const form = new FormData();
    form.append("file", file);
    form.append("caption", content);
    form.append("igId", igId);

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
    let published = false;

    // ========================================
    // 📡 STREAM HANDLING
    // ========================================
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (!part.startsWith("data:")) continue;

        const msg = JSON.parse(part.slice(5).trim());

        addStep("instagram", name, {
          step: msg.step,
          status: msg.status,
          error: msg.error || null
        });

        if (msg.step === "publish" && msg.status === "success") {
          published = true;
          setPostSummary(prev => [
            ...prev,
            { platform: "Instagram", target: name }
          ]);
        }

        if (msg.step === "fatal") {
          throw new Error(msg.error || "Instagram fatal error");
        }

        if (msg.status === "error") {
          throw new Error(msg.error || "Instagram failed");
        }
      }
    }

    if (!published) {
      throw new Error("Instagram post failed (not published)");
    }

    addStep("instagram", name, "success");

  } catch (err) {
    console.error("Instagram post error:", err.message);

    addStep("instagram", name, {
      step: "fatal",
      status: "error",
      error: err.message
    });

    throw err;
  }
}
