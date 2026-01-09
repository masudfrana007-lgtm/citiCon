// src/components/platforms/posters/InstagramPoster.js

export async function postToInstagram({
  file,
  content,
  igId,
  igAccounts,
  addStep,
  setPostSummary
}) {
  const account = igAccounts.find(a => a.ig_id === igId);
  const igName = account ? `@${account.username}` : "Instagram";

  let publishedMediaId = null;
  let publishedPermalink = null;

  // initial UI state
  addStep("instagram", igName, "pending");

  let published = false;

  try {
    // ===============================
    // 📤 Upload to backend (SSE)
    // ===============================
    const form = new FormData();
    form.append("file", file);
    form.append("caption", content || "");
    form.append("igId", igId);

    const res = await fetch("/auth/instagram/media", {
      method: "POST",
      body: form,
      credentials: "include"
    });

    if (!res.body) {
      throw new Error("Browser does not support streaming responses");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    // ===============================
    // 📡 SSE reader loop
    // ===============================
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        if (!event.startsWith("data:")) continue;

        const msg = JSON.parse(event.slice(5).trim());

        // Always reflect backend state
        addStep("instagram", igName, {
          step: msg.step,
          status: msg.status || "pending",
          error: msg.error || null
        });

        // Publish confirmed
        if (msg.step === "publish" && msg.status === "success") {
          published = true;

          publishedMediaId = msg.media_id;     // 👈 REQUIRED
          publishedPermalink = msg.permalink;  // 👈 OPTIONAL but recommended

          setPostSummary(prev => [
            ...prev,
            { platform: "Instagram", target: igName }
          ]);
        }

        // Backend fatal error
        if (msg.step === "fatal") {
          throw new Error(msg.error || "Instagram fatal error");
        }

        // Step-level error
        if (msg.status === "error") {
          throw new Error(msg.error || "Instagram failed");
        }
      }
    }

    // ===============================
    // ✅ Final check
    // ===============================
    if (!published) {
      throw new Error("Instagram post was not published");
    }

    addStep("instagram", igName, "success");

    return {
      mediaId: publishedMediaId,
      permalink: publishedPermalink
    };    

  } catch (err) {
    console.error("Instagram error:", err.message);

    addStep("instagram", igName, {
      step: "fatal",
      status: "error",
      error: err.message
    });

    throw err;
  }
}
