import { Resend } from "resend";

function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CLR-${year}-${num}`;
}

function buildContactEmailHtml(data: any, refId: string, timestamp: string): string {
  const capabilitiesList = Array.isArray(data.capabilities) && data.capabilities.length > 0
    ? data.capabilities.map((c: string) => `<span style="display:inline-block; background-color:#1E1E1E; border:1px solid #333; color:#E85002; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; margin:2px 4px 2px 0;">${c}</span>`).join(" ")
    : "None specified";

  const productTypesList = Array.isArray(data.productType)
    ? data.productType.join(", ")
    : data.productType || "N/A";

  const phoneOrWhatsapp = data.phoneNumber || data.whatsappNumber || data.phoneOrWhatsapp || "Not provided";
  const messageContent = data.productDescription || data.ideaText || "No detailed message provided.";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Cleroy Contact Form Submission — ${data.fullName}</title>
      </head>
      <body style="background-color: #050505; color: #F5EFE7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px 15px;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #222222; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <div style="background-color: #111111; border-bottom: 1px solid #222222; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-family: monospace; font-size: 11px; letter-spacing: 0.25em; color: #E85002; font-weight: bold; text-transform: uppercase;">
              CLEROY CONTACT SUBMISSION
            </div>
            <div style="font-family: monospace; font-size: 11px; color: #888888; background: #1A1A1A; padding: 4px 10px; border-radius: 20px; border: 1px solid #333;">
              REF: ${refId}
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <h1 style="font-size: 24px; font-weight: 300; color: #FFFFFF; margin: 0 0 8px 0; font-family: Georgia, serif;">
              📩 New Contact Inquiry Received
            </h1>
            <p style="color: #A0A0A0; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
              A new visitor has submitted the contact form on Cleroy.
            </p>

            <!-- Visitor Profile -->
            <div style="background-color: #121212; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #E85002; margin: 0 0 16px 0;">
                Visitor Contact Details
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #E0E0E0;">
                <tr>
                  <td style="padding: 6px 0; color: #888888; width: 140px; font-family: monospace; font-size: 12px;">NAME:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #FFFFFF;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">EMAIL:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #E85002; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">PHONE / WHATSAPP:</td>
                  <td style="padding: 6px 0;">${phoneOrWhatsapp}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">COMPANY:</td>
                  <td style="padding: 6px 0;">${data.company || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">PREFERRED METHOD:</td>
                  <td style="padding: 6px 0; color: #E85002; font-weight: bold;">${Array.isArray(data.communications) ? data.communications.join(", ") : (data.preferredContactMethod || "Email")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">SUBMITTED AT:</td>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #AAAAAA;">${timestamp}</td>
                </tr>
              </table>
            </div>

            <!-- Project Details & Message -->
            <div style="background-color: #121212; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #E85002; margin: 0 0 16px 0;">
                Message & Project Vision
              </h3>
              <p style="font-size: 12px; font-family: monospace; color: #888888; margin: 0 0 4px 0;">PROJECT TYPE / CATEGORY:</p>
              <p style="font-size: 15px; font-weight: 500; color: #FFFFFF; margin: 0 0 16px 0;">${productTypesList}</p>

              <p style="font-size: 12px; font-family: monospace; color: #888888; margin: 0 0 4px 0;">MESSAGE CONTENT:</p>
              <div style="background: #0A0A0A; border-left: 3px solid #E85002; padding: 12px 16px; border-radius: 0 8px 8px 0; color: #DDDDDD; font-size: 14px; line-height: 1.6; margin-bottom: 16px; white-space: pre-wrap;">
${messageContent}
              </div>

              <p style="font-size: 12px; font-family: monospace; color: #888888; margin: 0 0 8px 0;">SELECTED CAPABILITIES / TAGS:</p>
              <div style="margin-bottom: 8px;">
                ${capabilitiesList}
              </div>
            </div>

            <!-- Execution Parameters -->
            <div style="background-color: #121212; border: 1px solid #262626; border-radius: 12px; padding: 20px;">
              <h3 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #E85002; margin: 0 0 16px 0;">
                Execution Parameters
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #E0E0E0;">
                <tr>
                  <td style="padding: 6px 0; color: #888888; width: 140px; font-family: monospace; font-size: 12px;">TIMELINE:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #FFFFFF;">${data.timeline || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">BUDGET RANGE:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #E85002;">${data.budget || "N/A"}</td>
                </tr>
              </table>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #111111; border-top: 1px solid #222222; padding: 16px 32px; text-align: center; font-family: monospace; font-size: 11px; color: #666666;">
            Cleroy Engineering • Auto-generated Dispatch
          </div>
        </div>
      </body>
    </html>
  `;
}

export default async function handler(req: any, res: any) {
  // CORS Headers for Vercel deployment
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Please send a POST request." });
  }

  try {
    let data = req.body;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return res.status(400).json({ success: false, error: "Invalid JSON request payload." });
      }
    }

    if (!data || !data.email || !data.fullName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: Name and Email are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address format.",
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const cleroyHqEmail = process.env.CLEROY_HQ_EMAIL || "cleroyhq@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Cleroy Engineering <onboarding@resend.dev>";

    const refId = generateReferenceId();
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "UTC",
    }) + " (UTC)";

    const isApiKeyConfigured = Boolean(
      resendApiKey &&
      resendApiKey.trim().length > 0 &&
      !resendApiKey.includes("MY_RESEND_API_KEY") &&
      !resendApiKey.includes("YOUR_")
    );

    if (!isApiKeyConfigured) {
      console.warn(`[Cleroy Email Dispatch] RESEND_API_KEY is not configured.`);
      return res.status(503).json({
        success: false,
        error: "Email service is unconfigured. Please set RESEND_API_KEY in environment variables.",
      });
    }

    const resend = new Resend(resendApiKey);

    const phoneOrWhatsapp = data.phoneNumber || data.whatsappNumber || data.phoneOrWhatsapp || "Not provided";
    const messageContent = data.productDescription || data.ideaText || "No detailed message provided.";

    const result = await resend.emails.send({
      from: fromEmail,
      to: [cleroyHqEmail],
      replyTo: data.email,
      subject: `New Cleroy Contact Form Submission — ${data.fullName}`,
      html: buildContactEmailHtml(data, refId, timestamp),
      text: `New Cleroy Contact Form Submission\n\n` +
            `Ref ID: ${refId}\n` +
            `Name: ${data.fullName}\n` +
            `Email: ${data.email}\n` +
            `Phone/WhatsApp: ${phoneOrWhatsapp}\n` +
            `Company: ${data.company || "Not specified"}\n` +
            `Message: ${messageContent}\n` +
            `Timeline: ${data.timeline || "N/A"}\n` +
            `Budget: ${data.budget || "N/A"}\n` +
            `Submitted At: ${timestamp}`,
    });

    if (result.error) {
      console.error("Failed to send email via Resend:", result.error);
      return res.status(500).json({
        success: false,
        error: `Unable to deliver email: ${result.error.message || "Email provider error"}`,
      });
    }

    return res.status(200).json({
      success: true,
      refId,
      message: "Message sent successfully. We'll get back to you soon.",
    });
  } catch (err: any) {
    console.error("Error in /api/submit-discovery handler:", err);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while sending your message. Please try again.",
    });
  }
}
