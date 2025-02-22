# OAuth2 Integration with AuthAction (Vanilla JavaScript)

This is a Vanilla JavaScript application demonstrating how to integrate OAuth2 authentication using [AuthAction](https://authaction.com/) with the `oauth4webapi` library.

## Overview

This application showcases how to:

- Authenticate users using AuthAction’s OAuth2 service.
- Handle the OAuth2 callback after authentication.
- Log out users and redirect them appropriately.

## Prerequisites

Before using this application, ensure you have:

1. **A registered application in AuthAction**:

   - Sign in to [AuthAction](https://app.authaction.com/).
   - Create an application.
   - Obtain the **Client ID** from the application settings.
   - Configure the **Redirect URI** and **Logout Redirect URI** as follows:
     - **Redirect URI**: `http://localhost:5173/callback.html`
     - **Logout Redirect URI**: `http://localhost:5173`

2. **Node.js and npm installed**: You can download and install them from [nodejs.org](https://nodejs.org/).

## Installation

1. **Clone the repository** (if applicable):

   ```bash
   git clone git@github.com:authaction/authaction-vanillajs-website-example.git
   cd authaction-vanillajs-website-example
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure your AuthAction OAuth2 credentials**:

   Create a `.env` file in the root directory and add the following:

   ```ini
   VITE_AUTHACTION_AUTHORIZATION_ENDPOINT=https://<tenant-name>.<tenant-region>.authaction.com/oauth2/authorize
   VITE_AUTHACTION_TOKEN_ENDPOINT=https://<tenant-name>.<tenant-region>.authaction.com/oauth2/token
   VITE_AUTHACTION_LOGOUT_ENDPOINT=https://<tenant-name>.<tenant-region>.authaction.com/oauth2/logout
   VITE_AUTHACTION_CLIENT_ID=your-authaction-app-client-id
   VITE_AUTHACTION_REDIRECT_URI=http://localhost:5173/callback.html
   VITE_AUTHACTION_LOGOUT_REDIRECT_URI=http://localhost:5173
   ```

   Replace `<tenant-name>` and `<tenant-region>` with your actual AuthAction tenant details.

## Usage

1. **Start the development server**:

   ```bash
   npm run dev
   ```

   This will start the application on `http://localhost:5173`.

2. **Testing Authentication**:

   - Open your browser and navigate to `http://localhost:5173`.
   - Click the "Login" button to be redirected to the AuthAction login page.
   - After successful login, you will be redirected back to `callback.html`, which will process the authentication response.
   - The application will display user details after login.
   - Click the "Logout" button to log out and be redirected to the specified logout URL.

## Code Explanation

### Main Entry Point (`index.html`)

- Displays the login button.
- Redirects the user to AuthAction’s authorization endpoint upon clicking login.

### OAuth2 Callback (`callback.html`)

- Handles the OAuth2 callback response.
- Uses `oauth4webapi` to process and store authentication tokens.
- Redirects the user back to the main page after processing the login.

### OAuth2 Logic (`src/oauth.js`)

- Implements authentication, token storage, and logout functionalities.
- Uses `oauth4webapi` to interact with AuthAction’s OAuth2 endpoints.

## Common Issues

- **Redirects not working**:

  - Ensure that the `VITE_AUTHACTION_REDIRECT_URI` and `VITE_AUTHACTION_LOGOUT_REDIRECT_URI` match the URIs configured in your AuthAction application settings.
  - Make sure the application is running on `http://localhost:5173` as expected.

- **Network Errors**:
  - Verify that your network allows traffic to AuthAction servers and that there are no firewall rules blocking OAuth2 requests.

## Contributing

Feel free to submit issues or pull requests if you find any bugs or have improvements to suggest.

---

This project is a simple demonstration of integrating AuthAction’s OAuth2 authentication in a Vanilla JavaScript application using `oauth4webapi`. 🚀
