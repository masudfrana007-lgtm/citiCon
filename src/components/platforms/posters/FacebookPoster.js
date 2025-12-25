export async function postToFacebook({
  file,
  content,
  pageId,
  fbPages,
  addStep,
  setPostSummary
}) {
  const fbPage = fbPages.find(p => p.page_id === pageId);
  const fbName = fbPage?.page_name || "Facebook Page";

  addStep("facebook", fbName, "pending");

  try {
    if (!file) {
      const res = await fetch("/auth/facebook/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pageId, message: content || "" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
    } else {
      const form = new FormData();
      form.append("file", file);
      form.append("caption", content);
      form.append("pageId", pageId);

      const res = await fetch("/auth/facebook/media", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await res.json();
      if (!data.id) throw new Error("Facebook upload failed");
    }

    addStep("facebook", fbName, "success");
    setPostSummary(prev => [...prev, { platform: "Facebook", target: fbName }]);
  } catch (err) {
    addStep("facebook", fbName, "error");
    throw err;
  }
}
