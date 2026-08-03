import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Global reference ID counter
let projectSubmissionCounter = 1001;

function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const num = projectSubmissionCounter++;
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  return `CLR-${year}-${num}${randomSuffix}`;
}

// Generate HTML email for Cleroy Engineering HQ
function buildEngineeringEmailHtml(data: any, refId: string, timestamp: string): string {
  const capabilitiesList = Array.isArray(data.capabilities)
    ? data.capabilities.map((c: string) => `<span style="display:inline-block; background-color:#1E1E1E; border:1px solid #333; color:#E85002; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; margin:2px 4px 2px 0;">${c}</span>`).join(" ")
    : "None specified";

  const productTypesList = Array.isArray(data.productType)
    ? data.productType.join(", ")
    : data.productType || "N/A";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Project Request — ${data.fullName}</title>
      </head>
      <body style="background-color: #050505; color: #F5EFE7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px 15px;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #222222; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <div style="background-color: #111111; border-bottom: 1px solid #222222; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-family: monospace; font-size: 11px; letter-spacing: 0.25em; color: #E85002; font-weight: bold; text-transform: uppercase;">
              CLEROY ENGINEERING WORKSPACE
            </div>
            <div style="font-family: monospace; font-size: 11px; color: #888888; background: #1A1A1A; padding: 4px 10px; border-radius: 20px; border: 1px solid #333;">
              REF: ${refId}
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <h1 style="font-size: 24px; font-weight: 300; color: #FFFFFF; margin: 0 0 8px 0; font-family: Georgia, serif;">
              🚀 New Project Initiation
            </h1>
            <p style="color: #A0A0A0; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
              A new client submission was completed in the Project Discovery Workspace.
            </p>

            <!-- Summary Box -->
            <div style="background-color: #121212; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #E85002; margin: 0 0 16px 0;">
                Client Profile
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #E0E0E0;">
                <tr>
                  <td style="padding: 6px 0; color: #888888; width: 140px; font-family: monospace; font-size: 12px;">CLIENT NAME:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #FFFFFF;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">WORK EMAIL:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #E85002; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">COMPANY:</td>
                  <td style="padding: 6px 0;">${data.company || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">WEBSITE:</td>
                  <td style="padding: 6px 0;">${data.website ? `<a href="${data.website}" style="color: #E85002; text-decoration: none;">${data.website}</a>` : "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">LOCATION:</td>
                  <td style="padding: 6px 0;">${data.country || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">SUBMITTED AT:</td>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #AAAAAA;">${timestamp}</td>
                </tr>
              </table>
            </div>

            <!-- Product Specs -->
            <div style="background-color: #121212; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; color: #E85002; margin: 0 0 16px 0;">
                Product Vision & Architecture
              </h3>
              <p style="font-size: 12px; font-family: monospace; color: #888888; margin: 0 0 4px 0;">CATEGORY / TYPE:</p>
              <p style="font-size: 15px; font-weight: 500; color: #FFFFFF; margin: 0 0 16px 0;">${productTypesList}</p>

              <p style="font-size: 12px; font-family: monospace; color: #888888; margin: 0 0 4px 0;">VISION DESCRIPTION:</p>
              <div style="background: #0A0A0A; border-left: 3px solid #E85002; padding: 12px 16px; border-radius: 0 8px 8px 0; color: #DDDDDD; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
                "${data.productDescription || "N/A"}"
              </div>

              <p style="font-size: 12px; font-family: monospace; color: #888888; margin: 0 0 8px 0;">REQUIRED CAPABILITIES:</p>
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
                <tr>
                  <td style="padding: 6px 0; color: #888888; font-family: monospace; font-size: 12px;">PRIORITY VECTOR:</td>
                  <td style="padding: 6px 0;">${data.priority || "N/A"}</td>
                </tr>
                ${(() => {
                  const selectedComms = Array.isArray(data.communications) && data.communications.length > 0
                    ? data.communications
                    : (data.communication ? [data.communication] : ["Google Meet"]);

                  const commsFormattedHtml = selectedComms.map((method: string) => {
                    if (method === "Email") {
                      return `
                        <div style="margin-top: 6px; padding: 8px 12px; background: #0A0A0A; border: 1px solid #222; border-radius: 8px;">
                          <span style="color: #E85002; font-weight: bold; font-family: monospace;">✓ Email</span><br/>
                          <span style="font-size: 12px; color: #888888;">Email Address:</span> <span style="color: #E0E0E0;">${data.email}</span>
                        </div>
                      `;
                    }
                    if (method === "WhatsApp") {
                      const num = data.whatsappNumber || data.communicationNumber || "Not provided";
                      return `
                        <div style="margin-top: 6px; padding: 8px 12px; background: #0A0A0A; border: 1px solid #222; border-radius: 8px;">
                          <span style="color: #E85002; font-weight: bold; font-family: monospace;">✓ WhatsApp</span><br/>
                          <span style="font-size: 12px; color: #888888;">WhatsApp Number:</span> <span style="color: #E0E0E0;">${num}</span>
                        </div>
                      `;
                    }
                    if (method === "Google Meet") {
                      return `
                        <div style="margin-top: 6px; padding: 8px 12px; background: #0A0A0A; border: 1px solid #222; border-radius: 8px;">
                          <span style="color: #E85002; font-weight: bold; font-family: monospace;">✓ Google Meet</span><br/>
                          <span style="font-size: 12px; color: #888888;">Meeting Invitation:</span> <span style="color: #CCCCCC;">Use submitted email address (${data.email})</span>
                        </div>
                      `;
                    }
                    if (method === "Phone") {
                      const num = data.phoneNumber || data.communicationNumber || "Not provided";
                      return `
                        <div style="margin-top: 6px; padding: 8px 12px; background: #0A0A0A; border: 1px solid #222; border-radius: 8px;">
                          <span style="color: #E85002; font-weight: bold; font-family: monospace;">✓ Phone</span><br/>
                          <span style="font-size: 12px; color: #888888;">Phone Number:</span> <span style="color: #E0E0E0;">${num}</span>
                        </div>
                      `;
                    }
                    return `<div style="margin-top: 6px; color: #CCCCCC;">✓ ${method}</div>`;
                  }).join("");

                  return `<tr>
                    <td style="padding: 10px 0 4px 0; color: #888888; font-family: monospace; font-size: 12px; vertical-align: top; width: 140px;">PREFERRED CONTACT METHODS:</td>
                    <td style="padding: 6px 0;">${commsFormattedHtml}</td>
                  </tr>`;
                })()}
              </table>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #111111; border-top: 1px solid #222222; padding: 16px 32px; text-align: center; font-family: monospace; font-size: 11px; color: #666666;">
            Cleroy Engineering Workspace • Auto-generated Dispatch
          </div>
        </div>
      </body>
    </html>
  `;
}

// Generate HTML email for Client confirmation
function buildClientEmailHtml(clientName: string, refId: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Welcome to Cleroy</title>
      </head>
      <body style="background-color: #050505; color: #F5EFE7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px 15px;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #222222; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <div style="background-color: #111111; border-bottom: 1px solid #222222; padding: 24px 32px; text-align: left;">
            <div style="font-family: monospace; font-size: 11px; letter-spacing: 0.25em; color: #E85002; font-weight: bold; text-transform: uppercase;">
              CLEROY ENGINEERING
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 36px 32px; color: #D0D0D0; font-size: 15px; line-height: 1.7;">
            <p style="margin-top: 0; color: #FFFFFF; font-size: 18px; font-family: Georgia, serif;">
              Hi ${clientName},
            </p>

            <p style="color: #CCCCCC;">
              Thank you for choosing Cleroy Engineering.
            </p>

            <p style="color: #CCCCCC;">
              We've successfully received your project request.
            </p>

            <!-- Reference Box -->
            <div style="background-color: #121212; border: 1px border-style: dashed; border-color: #E85002; border-radius: 10px; padding: 18px; margin: 24px 0; text-align: center;">
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #888888; display: block; margin-bottom: 6px;">
                PROJECT REFERENCE ID
              </span>
              <span style="font-family: monospace; font-size: 20px; font-weight: bold; color: #E85002; letter-spacing: 0.1em;">
                ${refId}
              </span>
            </div>

            <p style="color: #CCCCCC;">
              Our engineering team will personally review your requirements and contact you within 24 hours.
            </p>

            <p style="color: #CCCCCC;">
              Thank you for trusting Cleroy.
            </p>

            <div style="margin-top: 32px; border-top: 1px solid #222222; padding-top: 20px;">
              <p style="margin: 0; color: #FFFFFF; font-weight: 500;">
                — <span style="color: #E85002; font-family: Georgia, serif; font-size: 16px;">Team Cleroy</span>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #111111; border-top: 1px solid #222222; padding: 16px 32px; text-align: center; font-family: monospace; font-size: 11px; color: #666666;">
            © ${new Date().getFullYear()} Cleroy Software. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

// API Route to process Project Discovery submissions
app.post("/api/submit-discovery", async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.email || !data.fullName) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload. Client name and email are required.",
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address format.",
      });
    }

    const refId = generateReferenceId();
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "UTC",
    }) + " (UTC)";

    const resendApiKey = process.env.RESEND_API_KEY;
    const cleroyHqEmail = process.env.CLEROY_HQ_EMAIL || "cleroyhq@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Cleroy Engineering <onboarding@resend.dev>";

    const isApiKeyConfigured = Boolean(
      resendApiKey &&
      resendApiKey.trim().length > 0 &&
      !resendApiKey.includes("MY_RESEND_API_KEY") &&
      !resendApiKey.includes("YOUR_")
    );

    if (!isApiKeyConfigured) {
      console.log(`[Cleroy Email Dispatch - Simulated Preview Mode]`);
      console.log(` - Generated Reference ID: ${refId}`);
      console.log(` - Target HQ Email: ${cleroyHqEmail}`);
      console.log(` - Client Email: ${data.email}`);
      console.log(` - Note: RESEND_API_KEY is not configured. To send live emails, configure RESEND_API_KEY in Environment Settings.`);

      return res.status(200).json({
        success: true,
        refId: refId,
        simulated: true,
        message: "Project discovery recorded successfully (Simulated preview mode: Configure RESEND_API_KEY to send live emails).",
      });
    }

    const resend = new Resend(resendApiKey);

    // Email 1: To Cleroy Engineering (Always sent)
    const engResult = await resend.emails.send({
      from: fromEmail,
      to: [cleroyHqEmail],
      subject: `🚀 New Project Request — ${data.fullName}`,
      html: buildEngineeringEmailHtml(data, refId, timestamp),
    });

    if (engResult.error) {
      console.error("Failed to send HQ email:", engResult.error);
      return res.status(500).json({
        success: false,
        error: `Failed to dispatch notification to Cleroy Engineering: ${engResult.error.message || "Email provider error"}`,
      });
    }

    // Email 2: To Client (Temporarily disabled in dev mode because Resend requires a verified sending domain to email arbitrary addresses)
    // To enable once a verified domain is configured, set ENABLE_CLIENT_CONFIRMATION_EMAIL="true" in environment variables.
    const enableClientEmail = process.env.ENABLE_CLIENT_CONFIRMATION_EMAIL === "true";

    if (enableClientEmail) {
      try {
        const clientResult = await resend.emails.send({
          from: fromEmail,
          to: [data.email],
          subject: "Welcome to Cleroy 🚀",
          html: buildClientEmailHtml(data.fullName, refId),
        });

        if (clientResult.error) {
          console.warn(`[Client Email Notice] Could not send client confirmation email to ${data.email}:`, clientResult.error.message);
        }
      } catch (clientErr: any) {
        console.warn(`[Client Email Notice] Error attempting client email:`, clientErr.message);
      }
    } else {
      console.log(`[Cleroy Email Dispatch] Client confirmation email is temporarily disabled because Resend is running without a verified sending domain.`);
    }

    return res.status(200).json({
      success: true,
      refId: refId,
      message: "Project discovery successfully submitted and dispatched to Cleroy Engineering.",
    });
  } catch (err: any) {
    console.error("Error in /api/submit-discovery:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected server error occurred while sending project emails.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
