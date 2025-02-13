import * as oauth from "https://cdn.jsdelivr.net/npm/oauth4webapi/+esm";

const AUTHORIZATION_ENDPOINT =
  "https://authaction-sample.eu.authaction.com/oauth2/authorize";
const TOKEN_ENDPOINT =
  "https://authaction-sample.eu.authaction.com/oauth2/token";
const LOGOUT_ENDPOINT =
  "https://authaction-sample.eu.authaction.com/oauth2/logout";
const CLIENT_ID = "6O8re2expWfGJoLbTyU5ExRe3thT6KbQ";
const REDIRECT_URI = "https://main.d8cd3nzbrs41c.amplifyapp.com/callback.html";
const LOGOUT_REDIRECT_URI = "https://main.d8cd3nzbrs41c.amplifyapp.com";
const SCOPES = "openid profile email";

// Store code verifier in sessionStorage (browser-safe)
function saveCodeVerifier(codeVerifier) {
  sessionStorage.setItem("code_verifier", codeVerifier);
}

// Retrieve the stored code verifier
function getCodeVerifier() {
  return sessionStorage.getItem("code_verifier");
}

// Step 1: Start OAuth2 login
export async function login() {
  const codeVerifier = oauth.generateRandomCodeVerifier();
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
  saveCodeVerifier(codeVerifier);

  const authUrl = new URL(AUTHORIZATION_ENDPOINT);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  window.location.href = authUrl.toString();
}

// Step 2: Handle OAuth2 callback
export async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    console.error("Authorization code not found!");
    return;
  }

  const codeVerifier = getCodeVerifier();
  if (!codeVerifier) {
    console.error("Code verifier not found!");
    return;
  }

  // Exchange authorization code for an access token
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  const tokens = await response.json();
  console.log("Access Token:", tokens.access_token);
  console.log("ID Token:", tokens.id_token);

  // Store tokens in sessionStorage (or localStorage)
  sessionStorage.setItem("id_token", tokens.id_token);
  sessionStorage.setItem("access_token", tokens.access_token);

  // Redirect to home page or protected area
  window.location.href = "index.html";
}

// Logout function: Clears tokens and redirects to the logout endpoint
export function logout() {
  // Clear tokens and code verifier from sessionStorage
  sessionStorage.removeItem("id_token");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("code_verifier");

  // Construct the logout URL
  const logoutUrl = new URL(LOGOUT_ENDPOINT);
  logoutUrl.searchParams.set("post_logout_redirect_uri", LOGOUT_REDIRECT_URI);

  // Redirect the browser to the logout endpoint
  window.location.href = logoutUrl.toString();
}
