# Firebase Phone Authentication Setup

This guide will help you set up Firebase Phone Authentication for the OwlAI application.

## Prerequisites

1. A Firebase project
2. Firebase project with Phone Authentication enabled
3. Valid domain for reCAPTCHA verification

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Phone" as a sign-in provider
   - Configure reCAPTCHA settings

## Step 2: Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web app or create a new one
4. Copy the configuration object

## Step 3: Environment Variables

Create a `.env` file in the Frontend directory with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_optional

# API Configuration
REACT_APP_API_URL=your_api_url_here
```

## Step 4: Firebase Authentication Rules

In Firebase Console > Authentication > Settings:

1. **Authorized domains**: Add your domain for production
2. **Phone numbers**: Configure allowed phone number formats
3. **reCAPTCHA**: Enable invisible reCAPTCHA

## Step 5: Security Rules

Configure Firebase Security Rules for your database:

```javascript
// Example Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to create sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Testing

1. Start the development server: `npm start`
2. Navigate to the phone authentication component
3. Test with a valid phone number
4. Verify OTP functionality

## Production Deployment

### Domain Configuration

1. Add your production domain to Firebase authorized domains
2. Configure reCAPTCHA for your domain
3. Update environment variables for production

### Security Considerations

1. **Rate Limiting**: Firebase handles rate limiting automatically
2. **Phone Number Validation**: Implement additional validation if needed
3. **Error Handling**: The app includes comprehensive error handling
4. **User Data**: Store minimal user data, only what's necessary

## Troubleshooting

### Common Issues

1. **"Phone authentication is not enabled"**
   - Enable Phone Authentication in Firebase Console

2. **"Invalid phone number format"**
   - Ensure phone numbers include country code (+1 for US)

3. **"reCAPTCHA verification failed"**
   - Check domain configuration in Firebase Console
   - Ensure reCAPTCHA is properly initialized

4. **"Quota exceeded"**
   - Check Firebase usage limits
   - Implement rate limiting if needed

### Debug Mode

Enable debug mode by setting:
```env
REACT_APP_DEBUG_MODE=true
```

## API Integration

The phone authentication is designed to work with your existing API:

1. **User Creation**: After successful phone verification, create user in your database
2. **Session Management**: Use Firebase UID for session management
3. **Data Synchronization**: Sync user data between Firebase and your API

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Domain Restrictions**: Restrict Firebase to your domains only
3. **Rate Limiting**: Monitor and implement rate limiting
4. **Data Validation**: Validate all user inputs
5. **Error Handling**: Don't expose sensitive information in error messages

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For application-specific issues:
- Check the application logs
- Review the error handling in the code
- Test with different phone numbers and scenarios
