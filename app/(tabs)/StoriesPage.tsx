"use client"

import { useState, useEffect } from "react"
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

const { width, height } = Dimensions.get("window")

const stories = {
  Calcifer: [
    { id: 1, image: "https://picsum.photos/id/11/300/500" },
    { id: 2, image: "https://picsum.photos/id/12/300/500" },
    { id: 3, image: "https://picsum.photos/id/13/300/500" },
    { id: 4, image: "https://picsum.photos/id/14/300/500" },
    { id: 5, image: "https://picsum.photos/id/15/300/500" },
  ],
  default: [
    { id: 1, user: "User 1", image: "https://picsum.photos/id/1/300/500" },
    { id: 2, user: "User 2", image: "https://picsum.photos/id/2/300/500" },
    { id: 3, user: "User 3", image: "https://picsum.photos/id/3/300/500" },
    { id: 4, user: "User 4", image: "https://picsum.photos/id/4/300/500" },
    { id: 5, user: "User 5", image: "https://picsum.photos/id/5/300/500" },
  ],
}

const StoriesPage = () => {
  const { initialStoryId, userId } = useLocalSearchParams()
  const [currentStoryIndex, setCurrentStoryIndex] = useState(Number(initialStoryId) - 1)
  const [currentUserId, setCurrentUserId] = useState(userId || "default")

  const currentStories = stories[currentUserId as keyof typeof stories] || stories.default

  useEffect(() => {
    setCurrentStoryIndex(Number(initialStoryId) - 1)
    setCurrentUserId(userId || "default")
  }, [initialStoryId, userId])

  const goToNextStory = () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else if (currentUserId === "default" && currentStoryIndex === currentStories.length - 1) {
      const nextUserId = Object.keys(stories)[Object.keys(stories).indexOf(currentUserId) + 1]
      if (nextUserId) {
        setCurrentUserId(nextUserId)
        setCurrentStoryIndex(0)
      } else {
        router.back()
      }
    } else {
      router.back()
    }
  }

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else if (currentUserId === "default" && currentStoryIndex === 0) {
      const prevUserId = Object.keys(stories)[Object.keys(stories).indexOf(currentUserId) - 1]
      if (prevUserId) {
        setCurrentUserId(prevUserId)
        setCurrentStoryIndex(stories[prevUserId as keyof typeof stories].length - 1)
      } else {
        router.back()
      }
    } else {
      router.back()
    }
  }

  const currentStory = currentStories[currentStoryIndex]

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={{ uri: currentStory.image }} style={styles.storyImage} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.username}>{currentUserId === "default" ? currentStory.user : currentUserId}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.leftHalf} onPress={goToPreviousStory} />
      <TouchableOpacity style={styles.rightHalf} onPress={goToNextStory} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  storyImage: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  leftHalf: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width / 2,
    height: height,
  },
  rightHalf: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width / 2,
    height: height,
  },
})

export default StoriesPage

