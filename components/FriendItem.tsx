"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"

interface FriendItemProps {
  friend: {
    user_id: number
    name: string
    pfp: string
    currentSong?: {
      name: string
      artist: string
    }
    listeningSince?: string
    tags?: string
  }
  onReact: (userId: number, reacted: boolean) => void
  onMessage: (userId: number) => void
}

const FriendItem: React.FC<FriendItemProps> = ({ friend, onReact, onMessage }) => {
  const [reacted, setReacted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReaction = async () => {
    setIsLoading(true)
    try {
      await onReact(friend.user_id, !reacted)
      setReacted(!reacted)
    } catch (error) {
      console.error("Error reacting to friend:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Default profile picture if none is provided
  const profilePic = friend.pfp ? { uri: friend.pfp } : require("../assets/images/profile-picture.png")

  return (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <Image source={profilePic} style={styles.avatar} />
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{friend.name}</Text>
          {friend.currentSong ? (
            <Text style={styles.songInfo}>
              <Feather name="music" size={14} color="#00E5FF" /> {friend.currentSong.name} • {friend.currentSong.artist}
            </Text>
          ) : (
            <Text style={styles.notListening}>Not listening to anything right now</Text>
          )}
          {friend.listeningSince && <Text style={styles.timeInfo}>{friend.listeningSince}</Text>}
          {friend.tags && <Text style={styles.tags}>{friend.tags}</Text>}
        </View>
      </View>
      <View style={styles.actionButtons}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#00E5FF" style={styles.loader} />
        ) : (
          <TouchableOpacity style={[styles.reactionButton, reacted && styles.reactedButton]} onPress={handleReaction}>
            <Feather name="heart" size={20} color={reacted ? "#fff" : "#00E5FF"} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={() => onMessage(friend.user_id)}>
          <Feather name="message-circle" size={20} color="#00E5FF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  friendCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  songInfo: {
    color: "#00E5FF",
    fontSize: 14,
    marginBottom: 2,
  },
  notListening: {
    color: "#999",
    fontSize: 14,
    marginBottom: 2,
    fontStyle: "italic",
  },
  timeInfo: {
    color: "#999",
    fontSize: 12,
  },
  tags: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  reactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#00E5FF",
  },
  reactedButton: {
    backgroundColor: "#00E5FF",
    borderColor: "#00E5FF",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00E5FF",
  },
  loader: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
})

export default FriendItem

