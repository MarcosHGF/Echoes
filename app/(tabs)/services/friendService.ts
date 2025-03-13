import apiClient from "../utils/aptClient"

export interface Friend {
  user_id: number
  name: string
  pfp: string
  musics?: string
  spotify_client?: string
  tags?: string
  currentSong?: {
    name: string
    artist: string
  }
  listeningSince?: string
}

export const getFriends = async (): Promise<Friend[]> => {
  try {
    const response = await apiClient.get("/followers")

    if (response.status === 200) {
      return response.data.map((friend: any) => ({
        user_id: friend.user_id,
        name: friend.name || `User ${friend.user_id}`,
        pfp: friend.pfp || null,
        musics: friend.musics,
        tags: friend.tags,
        currentSong: friend.current_song
          ? {
              name: friend.current_song.name || "Unknown Song",
              artist: friend.current_song.artist || "Unknown Artist",
            }
          : undefined,
        listeningSince: friend.listening_since || undefined,
      }))
    }

    throw new Error("Failed to fetch friends")
  } catch (error) {
    console.error("Error in getFriends:", error)
    throw error
  }
}

export const reactToFriendMusic = async (userId: number, reacted: boolean): Promise<void> => {
  try {
    await apiClient.post("/react-to-music", {
      user_id: userId,
      reacted,
    })
  } catch (error) {
    console.error("Error in reactToFriendMusic:", error)
    throw error
  }
}

export const sendMessageToFriend = async (userId: number, message: string): Promise<void> => {
  try {
    await apiClient.post("/send-message", {
      user_id: userId,
      message,
    })
  } catch (error) {
    console.error("Error in sendMessageToFriend:", error)
    throw error
  }
}

