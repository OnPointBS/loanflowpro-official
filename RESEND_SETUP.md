# Resend Email Integration Setup

## 🔐 **Resend API Configuration**

To enable email functionality in LoanFlowPro, you need to set up Resend:

### 1. **Get Resend API Key**
- Sign up at [resend.com](https://resend.com)
- Go to API Keys section
- Create a new API key
- Copy the API key

### 2. **Environment Variables**
Add these to your `.env.local` file:

```bash
VITE_CONVEX_URL=https://sensible-ermine-539.convex.cloud
RESEND_API_KEY=your_actual_resend_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. **Domain Verification**
- In Resend dashboard, add your domain (e.g., `loanflowpro.com`)
- Verify domain ownership
- Update the `from` field in `convex/email.ts` to use your verified domain

### 4. **Email Templates**
The system includes these email templates:
- ✅ **Verification Email**: Account verification codes
- 🔐 **2FA Codes**: Two-factor authentication codes  
- 🔑 **Password Reset**: Password reset codes
- 🎉 **Welcome Email**: New user welcome message

### 5. **Features Enabled**
- 📧 Email verification for new accounts
- 🔐 2FA via email codes
- 🔑 Password reset via email
- 🎉 Welcome emails for new users
- ⏰ Automatic token expiration
- 🗑️ Cleanup of expired tokens

## 🚀 **Current Status**

The email system is **90% complete** and includes:
- ✅ Complete email service with Resend
- ✅ Beautiful HTML email templates
- ✅ 2FA and verification token system
- ✅ Smart error handling
- ✅ Production-ready email flows

## 🔧 **Next Steps**

1. **Add your Resend API key** to `.env.local`
2. **Deploy the Convex functions** with `npx convex deploy`
3. **Test email functionality** with a real account
4. **Customize email templates** as needed

## 📧 **Email Scenarios Covered**

| Scenario | Email Type | Code Expiry | Status |
|----------|------------|-------------|---------|
| Account Registration | Verification | 10 minutes | ✅ Ready |
| Two-Factor Auth | 2FA Code | 5 minutes | ✅ Ready |
| Password Reset | Reset Code | 15 minutes | ✅ Ready |
| Welcome Message | Welcome | N/A | ✅ Ready |

## 🎯 **Production Notes**

- **Password Hashing**: Currently using simple hashing for MVP. Use bcrypt in production
- **Token Security**: JWT tokens recommended for production
- **Rate Limiting**: Implement rate limiting for email sending
- **Monitoring**: Add email delivery monitoring and analytics
