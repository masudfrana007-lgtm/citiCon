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

      console.log("fb post id :", data.id);   

  // Get public URL
      /*
      const postId = data.id;
      const postRes = await fetch(`https://graph.facebook.com/v19.0/${postId}?fields=permalink_url&access_token=${}`);
      /*
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
*/
      addStep("facebook", fbName, "success");
//      setPostSummary(prev => [...prev, { platform: "Facebook", target: name, url: permalink }]);
      setPostSummary(prev => [...prev, { platform: "Facebook", target: fbName }]);
//      return { postId, mediaUrl: permalink }; // Return for Instagram use
      return {
        postId: data.id,
        mediaUrl: data.mediaUrl // direct URL from backend
      };      
  }
} catch (err) {
    addStep("facebook", fbName, "error");
    throw err;
  }
}
