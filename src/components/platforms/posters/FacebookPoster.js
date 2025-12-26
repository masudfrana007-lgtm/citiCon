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
      
  // Get public URL
      const postId = data.id;
      const postRes = await fetch(`https://graph.facebook.com/v19.0/${postId}?fields=permalink_url&access_token=${/* get page token from DB if needed */}`);
      const postData = await postRes.json();
      const permalink = postData.permalink_url || `https://facebook.com/${postId}`;

      // Save to DB
      await fetch("/post/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: "facebook",
          sub_account_id: pageId,
          caption: content,
          media_url: permalink, // or extract actual image/video URL if needed
          post_id: postId,
          response_json: data
        })
      });

      addStep("facebook", name, "success");
      setPostSummary(prev => [...prev, { platform: "Facebook", target: name, url: permalink }]);
      return { postId, mediaUrl: permalink }; // Return for Instagram use
  } catch (err) {
    addStep("facebook", fbName, "error");
    throw err;
  }
}
