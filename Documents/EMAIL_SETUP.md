# Email Setup Guide

## Contact Form Email Configuration

The contact form on the website can send messages directly to your inbox. Follow these steps to enable email sending:

## 1. Set Up Gmail App Password

Since Gmail requires special authentication for third-party apps, you need to generate an **App Password**:

### Steps:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go back to Security settings
4. Find **App Passwords** (appears only after 2-Step Verification is enabled)
5. Select "Mail" and "Windows Computer" (or your device)
6. Copy the generated **16-character password**

## 2. Configure Backend Environment

Create a `.env` file in the `backend/` directory:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=harshalingaledev@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

Replace `your-16-character-app-password` with the password you generated in step 1.

## 3. Restart Backend Server

```bash
cd backend
"D:/C BACKUP/final-Case/.venv/Scripts/python.exe" -m uvicorn app.main:app --reload
```

## 4. Test the Contact Form

1. Go to http://localhost:5173/contact
2. Fill in the form with test data
3. Click "Send Message"
4. Check your email (harshalingaledev@gmail.com) for the message
5. The sender will receive a confirmation email

## What You'll Receive

When someone submits the contact form, you'll get:

**Admin Email:**
- Sender's name and email
- Subject line
- Full message
- Timestamp

**Customer Email:**
- Confirmation that their message was received
- Message summary
- Timeline for response

## Troubleshooting

### "Failed to send message" error:
- Check that SMTP_PASSWORD is correctly set in `.env`
- Verify Gmail App Password is 16 characters
- Make sure 2-Step Verification is enabled on Gmail account

### Emails not arriving:
- Check spam/promotions folder
- Verify SMTP_USER matches the Gmail account
- Check backend logs for detailed error messages

### Production Deployment:
For production, use environment variables or a secrets manager instead of `.env` file.

Example for production:
```bash
export SMTP_PASSWORD=your-app-password
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
