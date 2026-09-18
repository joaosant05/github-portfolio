import { profileConfig } from "../data/siteConfig";

export async function sendContactMessage(fields, signal) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(profileConfig.email)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal,
      body: JSON.stringify({
        ...fields,
        _subject: `Contato pelo portfólio: ${fields.subject}`,
        _replyto: fields.email,
        _template: "table",
      }),
    },
  );
  const result = await response.json();
  if (!response.ok || (result.success !== true && result.success !== "true")) {
    throw new Error("Contact submission failed");
  }
}
