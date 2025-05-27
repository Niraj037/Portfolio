"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useResponsiveLayout } from "../responsive-helpers"
import { useSettings } from "@/hooks/use-settings"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Search,
  Music,
  ListMusic,
  User,
  Disc,
  Loader2,
} from "lucide-react"
import {
  getSpotifyToken,
  searchTracks,
  getRecommendations,
  getUserPlaylists,
  getPlaylistTracks,
} from "@/app/actions/spotify"

// Declare the Spotify variable
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}

interface Track {
  id: string
  name: string
  artists: string
  album: string
  albumArt: string
  duration: number
  uri: string
}

interface Playlist {
  id: string
  name: string
  description: string
  image: string
  tracks: number
}

export default function MusicPlayerWindow() {
  const { deviceType } = useResponsiveLayout()
  const { settings } = useSettings()

  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: repeat all, 2: repeat one
  const [isLiked, setIsLiked] = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [recommendations, setRecommendations] = useState<Track[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Spotify player
  const playerRef = useRef<Spotify.Player | null>(null)
  const deviceIdRef = useRef<string | null>(null)
  const accessTokenRef = useRef<string | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Initialize Spotify SDK
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer()
    }

    return () => {
      document.body.removeChild(script)
      if (playerRef.current) {
        playerRef.current.disconnect()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Initialize player when SDK is ready
  const initializePlayer = async () => {
    try {
      setIsLoading(true)
      const token = await getSpotifyToken()

      if (!token) {
        setAuthError("Failed to get Spotify token. Please check your environment variables.")
        setIsLoading(false)
        return
      }

      accessTokenRef.current = token

      const player = new window.Spotify.Player({
        name: "Windows 98 Music Player",
        getOAuthToken: (cb) => {
          cb(token)
        },
        volume: volume / 100,
      })

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message)
        setAuthError(`Failed to initialize Spotify player: ${message}`)
      })

      player.addListener("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message)
        setAuthError(`Authentication failed: ${message}`)
      })

      player.addListener("account_error", ({ message }) => {
        console.error("Account error", message)
        setAuthError(`Account error: ${message}. Premium account required.`)
      })

      player.addListener("playback_error", ({ message }) => {
        console.error("Playback error", message)
      })

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id)
        deviceIdRef.current = device_id
        setIsAuthenticated(true)
        loadInitialContent()
      })

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id)
      })

      // State changes
      player.addListener("player_state_changed", (state) => {
        if (!state) return

        const track = state.track_window.current_track
        setCurrentTrack({
          id: track.id,
          name: track.name,
          artists: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || "/placeholder.svg?height=300&width=300",
          duration: state.duration / 1000,
          uri: track.uri,
        })

        setIsPlaying(!state.paused)
        setProgress(state.position / 1000)

        // Update queue
        const nextTracks = state.track_window.next_tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || "/placeholder.svg?height=300&width=300",
          duration: 0, // We don't have duration for queue tracks
          uri: track.uri,
        }))

        setQueue(nextTracks)
      })

      // Connect
      player.connect()
      playerRef.current = player

      // Progress tracking
      progressIntervalRef.current = setInterval(() => {
        if (isPlaying) {
          setProgress((prev) => {
            if (currentTrack && prev >= currentTrack.duration) {
              return 0
            }
            return prev + 1
          })
        }
      }, 1000)

      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing player:", error)
      setAuthError("Failed to initialize Spotify player. Please check your credentials.")
      setIsLoading(false)
    }
  }

  // Load initial content (recommendations, playlists)
  const loadInitialContent = async () => {
    if (!accessTokenRef.current) return

    try {
      setIsLoading(true)

      // Get recommendations
      const recs = await getRecommendations(accessTokenRef.current)
      if (recs) {
        setRecommendations(recs)
      }

      // Get user playlists
      const userPlaylists = await getUserPlaylists(accessTokenRef.current)
      if (userPlaylists) {
        setPlaylists(userPlaylists)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error loading initial content:", error)
      setIsLoading(false)
    }
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !accessTokenRef.current) return

    try {
      setIsLoading(true)
      const results = await searchTracks(accessTokenRef.current, searchQuery)
      setSearchResults(results || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Search error:", error)
      setIsLoading(false)
    }
  }

  // Load playlist tracks
  const loadPlaylistTracks = async (playlistId: string) => {
    if (!accessTokenRef.current) return

    try {
      setIsLoading(true)
      setSelectedPlaylist(playlistId)

      const tracks = await getPlaylistTracks(accessTokenRef.current, playlistId)
      if (tracks) {
        setPlaylistTracks(tracks)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error loading playlist tracks:", error)
      setIsLoading(false)
    }
  }

  // Play a track
  const playTrack = async (trackUri: string) => {
    if (!deviceIdRef.current || !accessTokenRef.current) return

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Play error:", error)
      }
    } catch (error) {
      console.error("Error playing track:", error)
    }
  }

  // Control functions
  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current.togglePlay()
    }
  }

  const skipNext = () => {
    if (playerRef.current) {
      playerRef.current.nextTrack()
    }
  }

  const skipPrevious = () => {
    if (playerRef.current) {
      playerRef.current.previousTrack()
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.setVolume(volume / 100)
      } else {
        playerRef.current.setVolume(0)
      }
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume / 100)
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
    // In a real implementation, we would call the Spotify API to toggle shuffle
  }

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3)
    // In a real implementation, we would call the Spotify API to toggle repeat
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    // In a real implementation, we would call the Spotify API to save/remove the track
  }

  // Render authentication error
  if (authError) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center">
        <div className="bg-white border-2 border-gray-400 p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-red-600">Authentication Error</h2>
          <p className="mb-4">{authError}</p>
          <div className="bg-gray-100 p-4 border border-gray-300 mb-4">
            <h3 className="font-bold mb-2">Required Environment Variables:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>SPOTIFY_CLIENT_ID</li>
              <li>SPOTIFY_CLIENT_SECRET</li>
              <li>SPOTIFY_REDIRECT_URI</li>
            </ul>
          </div>
          <Button
            className="win98-button bg-gray-300 text-black hover:bg-gray-200 w-full"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-800 mb-4" />
        <p className="text-lg">Connecting to Spotify...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top navigation */}
      <div className="bg-gray-100 border-b border-gray-400 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 py-1 ${activeTab === "home" ? "bg-gray-300" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Disc className="h-4 w-4 mr-1" />
            <span className={deviceType === "mobile" ? "hidden" : ""}>Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 py-1 ${activeTab === "search" ? "bg-gray-300" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            <Search className="h-4 w-4 mr-1" />
            <span className={deviceType === "mobile" ? "hidden" : ""}>Search</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 py-1 ${activeTab === "library" ? "bg-gray-300" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            <ListMusic className="h-4 w-4 mr-1" />
            <span className={deviceType === "mobile" ? "hidden" : ""}>Library</span>
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="px-3 py-1" onClick={() => {}}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto win98-scrollbar bg-gray-200 p-4">
        {/* Home Tab */}
        {activeTab === "home" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.map((track) => (
                <div
                  key={track.id}
                  className="bg-white border-2 border-gray-400 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => playTrack(track.uri)}
                >
                  <div className="relative aspect-square mb-2">
                    <img
                      src={track.albumArt || "/placeholder.svg?height=200&width=200"}
                      alt={track.album}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-sm truncate">{track.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{track.artists}</p>
                </div>
              ))}

              {recommendations.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-8">
                  <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p>No recommendations available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div>
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Search for songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="win98-input flex-1 mr-2"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button className="win98-button bg-gray-300 text-black hover:bg-gray-200" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center bg-white border-2 border-gray-400 p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => playTrack(track.uri)}
                  >
                    <img
                      src={track.albumArt || "/placeholder.svg?height=50&width=50"}
                      alt={track.album}
                      className="w-12 h-12 object-cover mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{track.name}</h3>
                      <p className="text-xs text-gray-600 truncate">
                        {track.artists} • {track.album}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 ml-2">{formatTime(track.duration)}</div>
                  </div>
                ))}
              </div>
            ) : searchQuery && !isLoading ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>No results found for "{searchQuery}"</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Library Tab */}
        {activeTab === "library" && (
          <div>
            {selectedPlaylist ? (
              <div>
                <Button variant="ghost" size="sm" className="mb-4" onClick={() => setSelectedPlaylist(null)}>
                  ← Back to playlists
                </Button>

                <h2 className="text-xl font-bold mb-4">
                  {playlists.find((p) => p.id === selectedPlaylist)?.name || "Playlist"}
                </h2>

                {playlistTracks.length > 0 ? (
                  <div className="space-y-2">
                    {playlistTracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center bg-white border-2 border-gray-400 p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => playTrack(track.uri)}
                      >
                        <img
                          src={track.albumArt || "/placeholder.svg?height=50&width=50"}
                          alt={track.album}
                          className="w-12 h-12 object-cover mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate">{track.name}</h3>
                          <p className="text-xs text-gray-600 truncate">
                            {track.artists} • {track.album}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">{formatTime(track.duration)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p>This playlist is empty</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-white border-2 border-gray-400 p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => loadPlaylistTracks(playlist.id)}
                    >
                      <div className="relative aspect-square mb-2">
                        <img
                          src={playlist.image || "/placeholder.svg?height=200&width=200"}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-sm truncate">{playlist.name}</h3>
                      <p className="text-xs text-gray-600">{playlist.tracks} tracks</p>
                    </div>
                  ))}

                  {playlists.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-8">
                      <ListMusic className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No playlists found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Now playing bar */}
      <div className="bg-gray-300 border-t border-gray-400 p-2">
        <div className="flex items-center">
          {/* Track info */}
          <div className="flex items-center flex-1 min-w-0">
            {currentTrack ? (
              <>
                <img
                  src={currentTrack.albumArt || "/placeholder.svg?height=50&width=50"}
                  alt={currentTrack.album}
                  className="w-12 h-12 object-cover mr-3 hidden sm:block"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{currentTrack.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{currentTrack.artists}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`ml-2 ${isLiked ? "text-red-500" : ""}`}
                  onClick={toggleLike}
                >
                  <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                </Button>
              </>
            ) : (
              <div className="text-sm text-gray-500">Not playing</div>
            )}
          </div>

          {/* Controls - always visible */}
          <div className="flex flex-col items-center">
            {/* Playback controls */}
            <div className="flex items-center mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1"
                onClick={toggleShuffle}
                disabled={!isAuthenticated}
              >
                <Shuffle className={`h-4 w-4 ${isShuffled ? "text-blue-600" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1"
                onClick={skipPrevious}
                disabled={!isAuthenticated}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-1 rounded-full bg-white border border-gray-400"
                onClick={togglePlay}
                disabled={!isAuthenticated}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-1" onClick={skipNext} disabled={!isAuthenticated}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1"
                onClick={toggleRepeat}
                disabled={!isAuthenticated}
              >
                <Repeat className={`h-4 w-4 ${repeatMode > 0 ? "text-blue-600" : ""}`} />
                {repeatMode === 2 && <span className="absolute text-[8px] font-bold">1</span>}
              </Button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center w-full px-2 space-x-2">
              <span className="text-xs">{formatTime(progress)}</span>
              <div className="flex-1 h-1 bg-gray-400 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${currentTrack ? (progress / currentTrack.duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs">{currentTrack ? formatTime(currentTrack.duration) : "0:00"}</span>
            </div>
          </div>

          {/* Volume control - hidden on mobile */}
          <div className="ml-4 hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-1" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              className="w-24"
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>

      {/* Queue panel - can be toggled */}
      {false && (
        <div className="absolute right-0 bottom-16 w-64 bg-white border-2 border-gray-400 shadow-lg">
          <div className="bg-gray-100 border-b border-gray-400 p-2 font-bold">Queue</div>
          <div className="p-2 max-h-64 overflow-auto">
            {queue.length > 0 ? (
              <div className="space-y-2">
                {queue.map((track, index) => (
                  <div key={`${track.id}-${index}`} className="flex items-center">
                    <img
                      src={track.albumArt || "/placeholder.svg?height=30&width=30"}
                      alt={track.album}
                      className="w-8 h-8 object-cover mr-2"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{track.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{track.artists}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">Queue is empty</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

