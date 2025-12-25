export async function postToTwitter({
  content,
  addStep,
  setPostSummary
}) {
  addStep("twitter", "X Account", "pending");

  const res = await fetch("/auth/x/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  if (!data.data?.id) throw new Error("Tweet failed");

  addStep("twitter", "X Account", "success");
  setPostSummary(p => [...p, { platform: "X", target: "Account" }]);
}
