export async function postToYouTube({
  file,
  title,
  content,
  channelId,
  ytChannels,
  addStep,
  setPostSummary
}) {
  const ch = ytChannels.find(c => c.channel_id === channelId);
  const name = ch?.channel_name || "YouTube Channel";

  addStep("youtube", name, "pending");

  try {
    const form = new FormData();
    form.append("file", file);
    form.append("title", title || content.slice(0, 90));
    form.append("description", content);
    form.append("channelId", channelId);

    const res = await fetch("/auth/youtube/upload", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    addStep("youtube", name, "success");
    setPostSummary(prev => [...prev, { platform: "YouTube", target: name }]);
  } catch (err) {
    addStep("youtube", name, "error");
    throw err;
  }
}
