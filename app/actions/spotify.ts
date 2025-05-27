"use server"

// Types
interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
  duration_ms: number
  uri: string
}

interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: { url: string }[]
  tracks: { total: number }
}

// Get Spotify access token
export async function getSpotifyToken(): Promise<string | null> {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error("Missing Spotify credentials")
      return null
    }

    // Base64 encode the client ID and secret
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

    // Get token from Spotify API
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    })

    if (!response.ok) {
      console.error("Failed to get Spotify token:", await response.text())
      return null
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting Spotify token:", error)
    return null
  }
}

// Search for tracks
export async function searchTracks(token: string, query: string) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      console.error("Search failed:", await response.text())
      return null
    }

    const data = await response.json()

    return data.tracks.items.map((track: SpotifyTrack) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || null,
      duration: track.duration_ms / 1000,
      uri: track.uri,
    }))
  } catch (error) {
    console.error("Error searching tracks:", error)
    return null
  }
}

// Get recommendations
export async function getRecommendations(token: string) {
  try {
    // Get some seed genres
    const genresResponse = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!genresResponse.ok) {
      console.error("Failed to get genres:", await genresResponse.text())
      return null
    }

    const genresData = await genresResponse.json()
    const seedGenres = genresData.genres.slice(0, 5).join(",")

    // Get recommendations
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to get recommendations:", await response.text())
      return null
    }

    const data = await response.json()

    return data.tracks.map((track: SpotifyTrack) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || null,
      duration: track.duration_ms / 1000,
      uri: track.uri,
    }))
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return null
  }
}

// Get user playlists
export async function getUserPlaylists(token: string) {
  try {
    const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists?limit=20", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to get playlists:", await response.text())
      return null
    }

    const data = await response.json()

    return data.playlists.items.map((playlist: SpotifyPlaylist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images[0]?.url || null,
      tracks: playlist.tracks.total,
    }))
  } catch (error) {
    console.error("Error getting playlists:", error)
    return null
  }
}

// Get playlist tracks
export async function getPlaylistTracks(token: string, playlistId: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to get playlist tracks:", await response.text())
      return null
    }

    const data = await response.json()

    return data.items
      .filter((item: any) => item.track) // Filter out null tracks
      .map((item: any) => {
        const track = item.track
        return {
          id: track.id,
          name: track.name,
          artists: track.artists.map((a: any) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || null,
          duration: track.duration_ms / 1000,
          uri: track.uri,
        }
      })
  } catch (error) {
    console.error("Error getting playlist tracks:", error)
    return null
  }
}

