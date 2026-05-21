# Social Login Implementation Guide for React Native

This document explains how the Groupify social login (Google & Discord) works in the web app and how to adapt it for React Native.

---

## How Social Login Works in Web App

### Current Web Flow

1. **User clicks social login button** (Google or Discord)
2. **Redirect to backend OAuth** - `window.location.href = ${VITE_BASE_URL}/auth/${provider}`
3. **User authenticates with provider** (Google/Discord on their servers)
4. **Backend creates session** and redirects back to the web app
5. **Session is detected** and user is logged in

### Key Code
```typescript
// In LoginScreen or RegisterScreen
const handleAuth = (provider: "google" | "discord") => {
  window.location.href = `${VITE_BASE_URL}/auth/${provider}`;
};
```

---

## Challenge for React Native

The web OAuth flow relies on browser redirects and session cookies. React Native doesn't have this.

---

## Solution: OAuth Redirect with Custom Scheme

### Step 1: Configure OAuth Providers

In your backend, you need to set up redirect URIs for your mobile app:

```
https://your-api.com/auth/google/callback
https://your-api.com/auth/discord/callback
```

### Step 2: Set Up URL Scheme in React Native

```typescript
// app.json or via code
{
  "scheme": "groupify"
}
```

### Step 3: Handle OAuth in React Native

There are two approaches:

---

## Approach A: Using Expo Auth Session (Recommended)

```typescript
// hooks/useSocialLogin.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useCallback } from 'react';

// Prevent the browser redirect from completing in web
WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: `${API_URL}/auth/google`,
  tokenEndpoint: `${API_URL}/auth/google/token`,
};

export function useGoogleLogin() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'groupify',
        path: 'oauth/callback/google',
      }),
    },
    discovery
  );

  const signIn = useCallback(async () => {
    const result = await promptAsync();
    if (result?.type === 'success') {
      // Exchange code for token
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: result.params.code,
          redirect_uri: AuthSession.makeRedirectUri({
            scheme: 'groupify',
            path: 'oauth/callback/google',
          }),
        }),
      });
      const tokenData = await tokenResponse.json();
      // Store token
      await AsyncStorage.setItem('auth_token', tokenData.data.token);
      return tokenData.data;
    }
  }, [promptAsync]);

  return { request, signIn };
}
```

---

## Approach B: Using Device Browser + Deep Link (Simpler)

This approach opens the OAuth in the device browser, then redirects back to your app.

### Step 1: Set up Deep Link URL Scheme

```typescript
// In your navigation setup
const linking = {
  prefixes: ['groupify://', 'https://nestfeed.app'],
  config: {
    screens: {
      OAuthCallback: 'oauth/callback/:provider',
    },
  },
};
```

### Step 2: Create OAuth Callback Screen

```typescript
// screens/OAuthCallbackScreen.tsx
import { useEffect, useContext } from 'react';
import { useSearchParams, useNavigation } from '@react-navigation/native';
import { AuthContext } from '@/context/AuthContext';

export function OAuthCallbackScreen() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      login(token);
      navigation.navigate('Main');
    } else if (error) {
      navigation.navigate('Login', { error });
    }
  }, [searchParams, login, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f43f5e" />
      <Text style={{ marginTop: 16 }}>Completing sign in...</Text>
    </View>
  );
}
```

### Step 3: Create Social Login Hook

```typescript
// hooks/useSocialLogin.ts
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-api.com';

export async function signInWithGoogle() {
  const redirectUrl = 'groupify://oauth/callback/google';
  const authUrl = `${API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;

  // Open in device browser
  await Linking.openURL(authUrl);
}

export async function signInWithDiscord() {
  const redirectUrl = 'groupify://oauth/callback/discord';
  const authUrl = `${API_URL}/auth/discord?redirect_uri=${encodeURIComponent(redirectUrl)}`;

  await Linking.openURL(authUrl);
}
```

### Step 4: Login Screen Implementation

```typescript
// screens/LoginScreen.tsx
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithGoogle, signInWithDiscord } from '@/hooks/useSocialLogin';

export function LoginScreen() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleDiscordLogin = async () => {
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error('Discord login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Google Button */}
      <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonIcon}>G</Text>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      {/* Discord Button */}
      <TouchableOpacity onPress={handleDiscordLogin} style={styles.socialButton}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonIcon}>D</Text>
          <Text style={styles.buttonText}>Continue with Discord</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  socialButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#1f2937',
  },
});
```

---

## Backend Requirements

Your backend needs to support the following:

### 1. OAuth Authorization URL with Redirect

When user visits `/auth/google` or `/auth/discord`:
- Redirect to Google/Discord OAuth consent screen
- After consent, redirect back to `groupify://oauth/callback/google?token=xxx`

### 2. Token Response in Redirect

Instead of just setting a cookie, include the token in the redirect URL:

```
groupify://oauth/callback/google?token=abc123&user_id=123
```

### 3. Backend Code Example (Node.js/Express)

```javascript
// routes/auth.js
app.get('/auth/google', (req, res) => {
  const redirectUri = `${process.env.MOBILE_SCHEME}://oauth/callback/google`;
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${process.env.GOOGLE_CLIENT_ID}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &response_type=code
    &scope=profile%20email
    &state=${req.query.redirect_uri || ''}`;

  res.redirect(authUrl);
});

app.get('/oauth/callback/google', async (req, res) => {
  const { code } = req.query;

  // Exchange code for tokens
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.MOBILE_SCHEME}://oauth/callback/google`,
  });

  // Get user info from Google
  const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
  });

  // Create or update user in database, get app token
  const appToken = await createSession(userResponse.data.email);

  // Redirect back to app with token
  res.redirect(`${process.env.MOBILE_SCHEME}://oauth/callback/google?token=${appToken}`);
});
```

---

## Session Check (Optional - For Connected Accounts)

The web app also has endpoints to check if user has connected Google/Discord:

```typescript
// Check if Google is connected
GET /auth/check-google-session

// Check if Discord is connected
GET /auth/check-discord-session

// Response
{
  connected: boolean;
  provider: string;
  expired: boolean;
  expiresAt: string | null;
}

// Disconnect
DELETE /auth/disconnect-google
DELETE /auth/disconnect-discord
```

---

## Summary: Key Points for React Native

1. **Two approaches**: Expo Auth Session (recommended) or Browser + Deep Link (simpler)

2. **Deep link setup**: Configure URL scheme `groupify://` in app.json

3. **OAuth flow**:
   - Open auth URL in device browser (or in-app browser)
   - User logs in with Google/Discord
   - Redirect back to app with token
   - Store token in AsyncStorage

4. **Backend changes**: Must redirect with token in URL instead of just cookies

5. **Key libraries**:
   - `expo-auth-session` - For OAuth handling
   - `@react-native-async-storage/async-storage` - For token storage
   - `expo-linking` - For deep links

6. **UI**: Style social buttons the same as web (outline, with icons)