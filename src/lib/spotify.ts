/**
 * Spotify data fetcher, run at build time.
 *
 * Required environment variables (in .env locally, GitHub secrets in CI):
 *   SPOTIFY_CLIENT_ID      – your Spotify app's client ID
 *   SPOTIFY_CLIENT_SECRET  – your Spotify app's client secret
 *   SPOTIFY_REFRESH_TOKEN  – long-lived refresh token (get it once via `npm run spotify-token`)
 */

export interface Album {
  name: string;
  artist: string;
  imageUrl: string | null;
  spotifyUrl: string;
}

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = import.meta.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Spotify credentials are not set");
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`token request failed: ${res.status}`);
  return (await res.json()).access_token;
}

/** Top `limit` unique albums from the user's top tracks over ~6 months. */
async function fetchTopAlbums(limit: number): Promise<Album[]> {
  const res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", {
    headers: { Authorization: `Bearer ${await getAccessToken()}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`top tracks request failed: ${res.status}`);
  const { items = [] } = await res.json();

  const albums = new Map<string, Album>();
  for (const { album } of items) {
    if (albums.has(album.id)) continue;
    albums.set(album.id, {
      name: album.name,
      artist: album.artists.map((a: { name: string }) => a.name).join(", "),
      imageUrl: album.images?.[0]?.url ?? null,
      spotifyUrl: album.external_urls?.spotify ?? "#",
    });
    if (albums.size >= limit) break;
  }
  return [...albums.values()];
}

/** Never throws: a failed fetch shouldn't break the build. */
export async function getTopAlbums(limit = 5): Promise<Album[]> {
  try {
    const albums = await fetchTopAlbums(limit);
    console.log(`[spotify] Fetched ${albums.length} albums`);
    return albums;
  } catch (err) {
    console.warn(`[spotify] Warning: could not fetch data — ${(err as Error).message}`);
    return [];
  }
}
