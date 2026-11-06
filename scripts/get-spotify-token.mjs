/**
 * One-time helper to obtain a Spotify refresh token.
 *
 * Steps:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add http://127.0.0.1:8888/callback as a Redirect URI in the app settings
 *   3. Copy your Client ID and Secret into .env (see .env.example)
 *   4. Run: npm run spotify-token
 *   5. Open the printed URL, log in and authorise
 *   6. Copy the printed SPOTIFY_REFRESH_TOKEN into your .env and GitHub secrets
 *
 * You only need to do this once. The refresh token doesn't expire unless you
 * revoke the app's access from your Spotify account.
 */

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.");
  process.exit(1);
}

const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const state = randomBytes(16).toString("hex");

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: "user-top-read",
  state,
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  const code = url.searchParams.get("code");
  if (!code || url.searchParams.get("state") !== state) {
    res.writeHead(400).end("Authorisation failed — check the terminal.");
    console.error("Authorisation failed:", url.searchParams.get("error") ?? "state mismatch");
    return server.close();
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
  });
  const body = await tokenRes.json();

  if (!tokenRes.ok) {
    res.writeHead(500).end("Token exchange failed — check the terminal.");
    console.error("Token exchange failed:", body);
  } else {
    res.writeHead(200).end("Done! You can close this tab and go back to the terminal.");
    console.log("\n--- Add this to your .env and GitHub Actions secrets ---");
    console.log(`SPOTIFY_REFRESH_TOKEN=${body.refresh_token}`);
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Open this URL in your browser to authorise:\n");
  console.log(authUrl.href, "\n");
});
