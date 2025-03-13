"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import getAPI from "@/app/(tabs)/Ngrok";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PostCreationModalProps {
  visible: boolean;
  onClose: () => void;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({
  visible,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const inputRef = useRef<TextInput | null>(null);

  const name = "GOAT";
  const user_id = 1;
  const API_URL = getAPI();

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert("Invalid Input", "Post content cannot be empty.", [
        { text: "OK" },
      ]);
      return;
    }

    console.log(content);
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
      const refresh_token = await AsyncStorage.getItem("refresh_token");
      if (!refresh_token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(API_URL + `/posts/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
          refresh_token: refresh_token,
        },
        body: JSON.stringify({ content, user_id, name }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create post.";
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse server response:", parseError);
        }
        throw new Error(errorMessage);
      }

      Alert.alert("Success", "Your post has been created!", [{ text: "OK" }]);
      setContent("");
      onClose();
    } catch (err) {
      Alert.alert(
        "Post Failed",
        err instanceof Error ? err.message : "An unexpected error occurred.",
        [{ text: "Try Again" }]
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postButton}
              onPress={handlePost}
              disabled={content.length === 0}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            ref={inputRef}
            style={styles.input}
            multiline
            placeholder="What's on your mind?"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            maxLength={250}
          />
          <Text style={styles.charCount}>{content.length}/250</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton}>
              <Feather name="image" size={24} color="#00E5FF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
              <Feather name="film" size={24} color="#00E5FF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#00E5FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#1A1A1A",
    fontWeight: "bold",
  },
  input: {
    color: "#fff",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    color: "#999",
    textAlign: "right",
    marginTop: 10,
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  mediaButton: {
    marginRight: 20,
  },
});

export default PostCreationModal;
