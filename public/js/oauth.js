import * as oauth from "https://cdn.jsdelivr.net/npm/oauth4webapi/+esm";

const AUTHORIZATION_ENDPOINT = "https://your-oauth-provider.com/authorize";
const TOKEN_ENDPOINT = "https://your-oauth-provider.com/token";
const CLIENT_ID = "your_client_id";
const REDIRECT_URI = "http://localhost:5500/callback.html";
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

  // Store token in sessionStorage (or localStorage)
  sessionStorage.setItem("access_token", tokens.access_token);

  // Redirect to home page or protected area
  window.location.href = "index.html";
}
