"use client"

import { useState, useEffect, memo, useCallback, useMemo } from "react"
import { View, TouchableOpacity, StyleSheet, Text, Platform, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import PostCreationModal from "./PostCreationModal"
import getAPI from "../app/(tabs)/Ngrok"

const API_URL = getAPI();

const BottomContainer = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // Progress in seconds
  const [duration, setDuration] = useState(180) // Default duration of 3 minutes (180 seconds)
  const [currentTrack, setCurrentTrack] = useState({ name: "Song Name", artist: "Artist" })
  const [isPostModalVisible, setIsPostModalVisible] = useState(false)

  const navigation = useNavigation()

  const tabItems = useMemo(
    () => [
      { icon: "home", label: "Home" },
      { icon: "search", label: "Search" },
      { icon: "heart", label: "Make" },
      { icon: "user", label: "Profile" },
    ],
    [],
  )

  const goToPage = useCallback(
    (item) => {
      const selectedLabel = item.label
      console.log("Navigating to:", item.label)

      switch (selectedLabel) {
        case "Home":
          navigation.navigate("(tabs)/MainPage")
          break
        case "Search":
          navigation.navigate("(tabs)/SearchPage")
          break
        case "Make":
          navigation.navigate("(tabs)/MakePage")
          break
        case "Profile":
          navigation.navigate("(tabs)/ProfilePage")
          break
        default:
          navigation.navigate("(tabs)/MainPage")
          break
      }
    },
    [navigation],
  )

  // Fetch current playback state from the backend
  const fetchPlaybackState = useCallback(async () => {
    try {
      const response = await fetch(API_URL + "/current-playback")
      const data = await response.json()

      if (data.is_playing !== undefined) {
        setIsPlaying(data.is_playing)
        setProgress(data.progress_ms / 1000) // Convert milliseconds to seconds
        setDuration(data.duration_ms / 1000) // Convert milliseconds to seconds
        setCurrentTrack({
          name: data.item?.name || "Song Name",
          artist: data.item?.artists?.[0]?.name || "Artist",
        })
      }
    } catch (error) {
      console.error("Error fetching playback state:", error)
    }
  }, [])

  // Play or pause the song via the backend
  const handlePlayPause = useCallback(async () => {
    try {
      if (!isPlaying) {
        await fetch(API_URL + "/play", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uri: 'spotify:track:4cOdK2wGLETKBW3PvgPWqT' }), // Example track URI
        })
      } else {
        await fetch(API_URL + "/pause", { method: 'POST' })
      }
    } catch (error) {
      console.error("Error controlling playback:", error)
    }
  }, [isPlaying])

  // Poll for playback updates every second
  useEffect(() => {
    const interval = setInterval(fetchPlaybackState, 1000)
    return () => clearInterval(interval)
  }, [fetchPlaybackState])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <>
      <View style={styles.bottomContainer}>
        {/* Player */}
        <View style={styles.player} pointerEvents="box-none">
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {currentTrack.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          <View style={styles.mainControls}>
            <View style={styles.timelineContainer}>
              <View style={styles.timeline}>
                <Animated.View style={[styles.progressBar, { width: `${(progress / duration) * 100}%` }]} />
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeText}>{formatTime(progress)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity onPress={() => console.log("Previous")}>
                <Feather name="skip-back" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
                <Feather name={isPlaying ? "pause" : "play"} size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Next")}>
                <Feather name="skip-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          {tabItems.map((item, index) => (
            <TouchableOpacity activeOpacity={0.7} key={index} style={styles.tabItem} onPress={() => goToPage(item)}>
              <Feather name={item.icon} size={24} color="#fff" />
              <Text style={styles.tabLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.createPostButton}
            onPress={() => setIsPostModalVisible(true)}
          >
            <Feather name="plus-circle" size={24} color="#00E5FF" />
            <Text style={[styles.tabLabel, styles.createPostLabel]}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <PostCreationModal visible={isPostModalVisible} onClose={() => setIsPostModalVisible(false)} />
    </>
  )
})

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
  },
  tabItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  player: {
    height: 85,
    backgroundColor: "#2fb201",
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  songInfo: {
    flex: 1,
    marginRight: 15,
  },
  songTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  artistName: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  mainControls: {
    flex: 2,
  },
  timelineContainer: {
    width: "100%",
    marginBottom: 8,
  },
  timeline: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  playPauseButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  createPostButton: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  createPostLabel: {
    color: "#00E5FF",
  },
})

export default BottomContainer