import * as oauth from "https://cdn.jsdelivr.net/npm/oauth4webapi/+esm";

const AUTHORIZATION_ENDPOINT = import.meta.env
  .VITE_AUTHACTION_AUTHORIZATION_ENDPOINT;
const TOKEN_ENDPOINT = import.meta.env.VITE_AUTHACTION_TOKEN_ENDPOINT;
const LOGOUT_ENDPOINT = import.meta.env.VITE_AUTHACTION_LOGOUT_ENDPOINT;
const CLIENT_ID = import.meta.env.VITE_AUTHACTION_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_AUTHACTION_REDIRECT_URI;
const LOGOUT_REDIRECT_URI = import.meta.env.VITE_AUTHACTION_LOGOUT_REDIRECT_URI;
const SCOPES = "openid profile email";

function saveCodeVerifier(codeVerifier) {
  sessionStorage.setItem("code_verifier", codeVerifier);
}

function getCodeVerifier() {
  return sessionStorage.getItem("code_verifier");
}

async function buildAuthUrl(extraParams = {}) {
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
  for (const [key, value] of Object.entries(extraParams)) {
    authUrl.searchParams.set(key, value);
  }
  return authUrl.toString();
}

export async function login() {
  window.location.href = await buildAuthUrl();
}

export async function signup() {
  window.location.href = await buildAuthUrl({ screen_hint: "signup" });
}

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

  sessionStorage.setItem("id_token", tokens.id_token);
  sessionStorage.setItem("access_token", tokens.access_token);

  window.location.href = "/claims.html";
}

export function logout() {
  const logoutUrl = new URL(LOGOUT_ENDPOINT);
  logoutUrl.searchParams.set("post_logout_redirect_uri", LOGOUT_REDIRECT_URI);
  logoutUrl.searchParams.set(
    "id_token_hint",
    sessionStorage.getItem("id_token")
  );

  sessionStorage.removeItem("id_token");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("code_verifier");

  window.location.href = logoutUrl.toString();
}
