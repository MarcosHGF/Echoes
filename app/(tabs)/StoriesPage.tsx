"use client"

import { useState } from "react"
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

const { width, height } = Dimensions.get("window")

const stories = [
  { id: 1, user: "User 1", image: "https://picsum.photos/id/1/300/500" },
  { id: 2, user: "User 2", image: "https://picsum.photos/id/2/300/500" },
  { id: 3, user: "User 3", image: "https://picsum.photos/id/3/300/500" },
  { id: 4, user: "User 4", image: "https://picsum.photos/id/4/300/500" },
  { id: 5, user: "User 5", image: "https://picsum.photos/id/5/300/500" },
]

const StoriesPage = () => {
  const { initialStoryId } = useLocalSearchParams()
  const [currentStoryIndex, setCurrentStoryIndex] = useState(Number(initialStoryId) - 1)

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      router.back()
    }
  }

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else {
      router.back()
    }
  }

  const currentStory = stories[currentStoryIndex]

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={{ uri: currentStory.image }} style={styles.storyImage} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.username}>{currentStory.user}</Text>
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

