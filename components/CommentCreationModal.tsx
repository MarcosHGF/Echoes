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

interface CommentCreationModalProps {
  visible: boolean;
  onClose: () => void;
  postId?: number; // Optional postId - if provided, we're creating a comment
  parentCommentId?: number; // Optional for nested comments
  onCommentAdded?: () => void; // Callback to refresh comments after adding
}

const CommentCreationModal: React.FC<CommentCreationModalProps> = ({
  visible,
  onClose,
  postId,
  parentCommentId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const inputRef = useRef<TextInput | null>(null);
  const isComment = postId !== undefined;

  const API_URL = getAPI();

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Invalid Input", "Content cannot be empty.", [
        { text: "OK" },
      ]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
      const refresh_token = await AsyncStorage.getItem("refresh_token");
      if (!refresh_token) {
        throw new Error("No authentication token found.");
      }

      // Prepare the request body based on whether it's a post or comment
      const requestBody: any = { content };

      // If it's a comment, add the postId
      if (isComment) {
        requestBody.parent_id = postId;

        // If it's a reply to another comment, add the parent comment ID
        if (parentCommentId) {
          requestBody.parent_comment_id = parentCommentId;
        }
      }

      // Determine the endpoint based on whether it's a post or comment

      const response = await fetch(API_URL + `/posts/0`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
          Cookie: `refresh_token=${refresh_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = isComment
          ? "Failed to add comment."
          : "Failed to create post.";
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse server response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const successMessage = isComment
        ? "Your comment has been added!"
        : "Your post has been created!";

      Alert.alert("Success", successMessage, [{ text: "OK" }]);
      setContent("");

      // Call the callback if it exists
      if (isComment && onCommentAdded) {
        onCommentAdded();
      }

      onClose();
    } catch (err) {
      Alert.alert(
        isComment ? "Comment Failed" : "Post Failed",
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
            <Text style={styles.headerTitle}>
              {isComment
                ? parentCommentId
                  ? "Reply"
                  : "Add Comment"
                : "Create Post"}
            </Text>
            <TouchableOpacity
              style={styles.postButton}
              onPress={handleSubmit}
              disabled={content.length === 0}
            >
              <Text style={styles.postButtonText}>
                {isComment ? "Comment" : "Post"}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            ref={inputRef}
            style={styles.input}
            multiline
            placeholder={
              isComment ? "Write a comment..." : "What's on your mind?"
            }
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            maxLength={isComment ? 150 : 250}
          />
          <Text style={styles.charCount}>
            {content.length}/{isComment ? 150 : 250}
          </Text>
          {!isComment && (
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton}>
                <Feather name="image" size={24} color="#00E5FF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <Feather name="film" size={24} color="#00E5FF" />
              </TouchableOpacity>
            </View>
          )}
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
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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

export default CommentCreationModal;
