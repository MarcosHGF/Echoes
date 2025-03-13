"use client"

import type React from "react"
import { useState } from "react"
import { TouchableOpacity, StyleSheet, View, Dimensions, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"
import PostCreationModal from "./PostCreationModal"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

interface FloatingActionButtonProps {
  bottomOffset?: number
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  bottomOffset = 150, // Default offset to account for the bottom container
}) => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false)
  const insets = useSafeAreaInsets()

  // Calculate the bottom position based on the provided offset and safe area
  const buttonBottomPosition = bottomOffset + (Platform.OS === "ios" ? insets.bottom : 0)

  return (
    <>
      <View style={[styles.container, { bottom: buttonBottomPosition }]}>
        <TouchableOpacity style={styles.button} onPress={() => setIsPostModalVisible(true)} activeOpacity={0.8}>
          <Feather name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <PostCreationModal visible={isPostModalVisible} onClose={() => setIsPostModalVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    zIndex: 999,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00E5FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default FloatingActionButton

