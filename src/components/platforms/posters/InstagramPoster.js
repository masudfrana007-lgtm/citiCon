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
    form.append("file", file);        // ✅ REQUIRED
    form.append("caption", content);
    form.append("igId", igId);

    const res = await fetch("/auth/instagram/media", {
      method: "POST",
      body: form,
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.message || "Instagram post failed");
    }

    addStep("instagram", name, "success");
    setPostSummary(prev => [
      ...prev,
      { platform: "Instagram", target: name }
    ]);

  } catch (err) {
    console.error(err);
    addStep("instagram", name, "error");
    throw err;
  }
}
