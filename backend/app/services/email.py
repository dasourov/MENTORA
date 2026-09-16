import logging
import httpx
from app.core.config import settings

logger = logging.getLogger("mentora.email")


def generate_passcode_html(passcode: str, full_name: str = "Student") -> str:
    """Generates a responsive, branded HTML email template for the verification passcode."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Mentora Verification Passcode</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560px" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">MENTORA</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 500;">Verified Study-Abroad Mentorship & Advisory</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Verify your email address</h2>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Hello <strong>{full_name}</strong>,<br>
                Thank you for beginning your student journey with Mentora. Please enter the verification passcode below to verify your email and continue your profile setup:
              </p>

              <!-- Passcode Display Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="background-color: #f1f5f9; border-radius: 16px; border: 2px dashed #cbd5e1; padding: 24px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your One-Time Passcode</div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #0f172a; letter-spacing: 8px;">{passcode}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Expires in <strong>10 minutes</strong></div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                <strong>Security Notice:</strong> Never share this passcode with anyone. Mentora representatives will never ask you for your passcode.
              </p>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 Mentora Platform. All rights reserved.<br>
                Empowering students with verified global mentors.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_verification_passcode_email(email: str, passcode: str, full_name: str = "Student") -> dict:
    """Dispatches a verification passcode email using the Resend API."""
    api_key = settings.RESEND_API_KEY
    from_email = settings.RESEND_FROM_EMAIL
    subject = f"Your Mentora Verification Passcode: {passcode}"
    html_content = generate_passcode_html(passcode, full_name)

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": from_email,
        "to": [email],
        "subject": subject,
        "html": html_content,
    }

    # Always log passcode in development console for instant developer feedback
    print(f"\n=======================================================")
    print(f"[MENTORA PASSCODE DISPATCH] -> {email}")
    print(f"PASSCODE: {passcode} (Expires in 10 minutes)")
    print(f"=======================================================\n")

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(
                "https://api.resend.com/emails",
                headers=headers,
                json=payload,
            )

        if response.status_code in (200, 201):
            data = response.json()
            logger.info(f"Resend delivered passcode email to {email}, id={data.get('id')}")
            return {"success": True, "id": data.get("id")}
        else:
            logger.warning(
                f"Resend email API returned status {response.status_code}: {response.text}"
            )
            return {
                "success": False,
                "status_code": response.status_code,
                "error": response.text,
            }
    except Exception as exc:
        logger.error(f"Failed to send email via Resend: {exc}")
        return {"success": False, "error": str(exc)}
