from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


def send_email(to_email: str, subject: str, html_content: str):
    """Send email using SMTP"""
    try:
        # Email configuration
        sender_email = settings.SMTP_USER or "noreply@legalaicasesolver.com"
        sender_password = settings.SMTP_PASSWORD
        smtp_server = settings.SMTP_SERVER or "smtp.gmail.com"
        smtp_port = settings.SMTP_PORT or 587

        # Validation
        if not sender_password:
            error_msg = "SMTP_PASSWORD not configured. Check your .env file."
            print(f"❌ Email Error: {error_msg}")
            raise Exception(error_msg)

        print(f"📧 Attempting to send email to {to_email}")
        print(f"📧 SMTP Server: {smtp_server}:{smtp_port}")
        print(f"📧 From: {sender_email}")

        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = sender_email
        message["To"] = to_email

        # Attach HTML content
        part = MIMEText(html_content, "html")
        message.attach(part)

        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            print(f"🔐 Authenticating with Gmail...")
            server.login(sender_email, sender_password)
            print(f"✓ Authentication successful")
            server.sendmail(sender_email, to_email, message.as_string())
            print(f"✓ Email sent successfully to {to_email}")

        return True
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"Gmail authentication failed. Check SMTP_PASSWORD in .env - Error: {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
    except smtplib.SMTPException as e:
        error_msg = f"SMTP error: {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
    except Exception as e:
        error_msg = f"Email sending failed: {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)


@router.post("/send", status_code=status.HTTP_200_OK)
async def send_contact_message(contact: ContactMessage):
    """
    Send contact message to admin email and reply to customer.
    """
    admin_email = "harshalingaledev@gmail.com"
    
    try:
        # HTML template for admin email
        admin_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #1e3a8a;">New Contact Form Submission</h2>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <p><strong>From:</strong> {contact.name}</p>
                    <p><strong>Email:</strong> <a href="mailto:{contact.email}">{contact.email}</a></p>
                    <p><strong>Subject:</strong> {contact.subject}</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <h3>Message:</h3>
                    <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                        {contact.message}
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">
                        <em>This message was sent via the contact form on the Legal AI Case Solver platform.</em>
                    </p>
                </div>
            </body>
        </html>
        """
        
        # HTML template for customer reply
        customer_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #1e3a8a;">Thank You for Contacting Us</h2>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <p>Hi {contact.name},</p>
                    
                    <p>Thank you for reaching out to <strong>Legal AI Case Solver</strong>. We have received your message and will get back to you as soon as possible.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h4 style="margin-top: 0;">Your Message Summary:</h4>
                        <p><strong>Subject:</strong> {contact.subject}</p>
                        <p><strong>Sent At:</strong> {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                    </div>
                    
                    <p>Our team will review your inquiry and respond within 24-48 hours.</p>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        <strong>Legal AI Case Solver Team</strong><br>
                        <a href="mailto:harshalingaledev@gmail.com">harshalingaledev@gmail.com</a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        <em>This is an automated response. Please do not reply to this email.</em>
                    </p>
                </div>
            </body>
        </html>
        """
        
        # Send admin email
        admin_sent = send_email(
            admin_email,
            f"New Contact Form: {contact.subject}",
            admin_html
        )
        
        if not admin_sent:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send contact message. Please try again later or call us directly."
            )
        
        # Send customer confirmation email
        customer_sent = send_email(
            contact.email,
            "We've Received Your Message - Legal AI Case Solver",
            customer_html
        )
        
        if not customer_sent:
            print(f"Warning: Could not send confirmation email to {contact.email}")
        
        return {
            "status": "success",
            "message": "Your message has been sent successfully. We'll get back to you soon.",
            "admin_notified": admin_sent,
            "confirmation_sent": customer_sent
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending message: {str(e)}"
        )
