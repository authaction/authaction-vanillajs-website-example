import { AuthActionClient } from "@authaction/web-sdk";

export const client = new AuthActionClient({
  domain: import.meta.env.VITE_AUTHACTION_DOMAIN,
  clientId: import.meta.env.VITE_AUTHACTION_CLIENT_ID,
  redirectUri: import.meta.env.VITE_AUTHACTION_REDIRECT_URI,
  postLogoutRedirectUri: import.meta.env.VITE_AUTHACTION_LOGOUT_REDIRECT_URI,
  cacheLocation: "localstorage",
});

export async function login() {
  await client.loginWithRedirect();
}

export async function signup() {
  await client.loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
}

export async function handleCallback() {
  await client.handleRedirectCallback();
  window.location.href = "/claims";
}

export async function logout() {
  await client.logout();
}
