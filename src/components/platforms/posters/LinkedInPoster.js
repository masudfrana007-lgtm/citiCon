export async function postToLinkedIn({
  content,
  addStep,
  setPostSummary
}) {
  const name = "LinkedIn Profile";

  addStep("linkedin", name, "pending");

  try {
    const res = await fetch("/auth/linkedin/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: content || "" }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    addStep("linkedin", name, "success");
    setPostSummary(prev => [...prev, { platform: "LinkedIn", target: name }]);
  } catch (err) {
    addStep("linkedin", name, "error");
    throw err;
  }
}
