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
    const form = new FormData();
    form.append("file", file);
    form.append("caption", content);
    form.append("igId", igId);

    const res = await fetch("/auth/instagram/media", {
      method: "POST",
      body: form,
      credentials: "include"
    });

    const data = await res.json();

    // 🔥 LOG EVERYTHING BACKEND SENT
    console.group("📸 Instagram Backend Response");
    console.log("Success:", data.success);
    console.log("Steps:", data.steps);
    console.groupEnd();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Instagram post failed");
    }

    addStep("instagram", name, "success");

    setPostSummary(prev => [
      ...prev,
      { platform: "Instagram", target: name }
    ]);

  } catch (err) {
    console.error("❌ Instagram Post Error:", err.message);
    addStep("instagram", name, "error");
    throw err;
  }
}
