export async function postToTwitter({
  content,
  addStep,
  setPostSummary
}) {
  addStep("twitter", "X Account", "pending");

  let data;

try {
    const res = await fetch("/auth/x/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
     data = await res.json();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${data.error || data.message || 'Unknown error'}`);
    }
    if (!data.data?.id) {
      throw new Error(`Tweet failed: Invalid response format - ${JSON.stringify(data)}`);
    }
    addStep("twitter", "X Account", "success");
    setPostSummary(p => [...p, { platform: "X", target: "Account" }]);
  } catch (err) {
    addStep("twitter", "X Account", "error");
    console.error('Detailed Twitter post error:', err.message, { responseData: data }); // Log more context
    throw err; // Re-throw to let confirmPost catch it
  }
}
