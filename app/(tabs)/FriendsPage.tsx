"use client";

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import apiClient from "../utils/aptClient";
import FriendItem from "../../components/FriendItem";
import getAPI from "./Ngrok";

interface Friend {
  user_id: number;
  name: string;
  pfp: string;
  musics?: string;
  spotify_client?: string;
  tags?: string;
  currentSong?: {
    name: string;
    artist: string;
  };
  listeningSince?: string;
}

const API_URL = getAPI();

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get(API_URL + "/followers");

      if (response.status === 200) {
        // Process the data to match our Friend interface
        const friendsData = response.data.map((friend: any) => ({
          user_id: friend.user_id,
          name: friend.name || `User ${friend.user_id}`, // Fallback if name is not provided
          pfp: friend.pfp || null,
          musics: friend.musics,
          tags: friend.tags,
          // We'll fetch current song info separately or assume it's included
          currentSong: friend.current_song
            ? {
                name: friend.current_song.name || "Unknown Song",
                artist: friend.current_song.artist || "Unknown Artist",
              }
            : undefined,
          listeningSince: friend.listening_since || undefined,
        }));

        setFriends(friendsData);
      } else {
        setError("Failed to fetch friends");
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("An error occurred while fetching friends");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFriends();
  }, [fetchFriends]);

  const handleReactToFriend = async (userId: number, reacted: boolean) => {
    try {
      // Send reaction to backend
      await apiClient.post("/react-to-music", {
        user_id: userId,
        reacted,
      });

      // You could update the local state here if needed
      return true;
    } catch (error) {
      console.error("Error reacting to friend:", error);
      throw error;
    }
  };

  const handleMessageFriend = (userId: number) => {
    // Navigate to chat or implement messaging functionality
    console.log(`Opening chat with user ${userId}`);
    // router.navigate(`/chat/${userId}`);
  };

  const filteredFriends = searchQuery
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.currentSong?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          friend.currentSong?.artist
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          friend.tags?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends Activity</Text>
        <TouchableOpacity>
          <Feather name="user-plus" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends or songs"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchQuery === "" && styles.activeToggle,
          ]}
          onPress={() => setSearchQuery("")}
        >
          <Text style={styles.toggleText}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchQuery === "" && styles.inactiveToggle,
          ]}
          onPress={() => setSearchQuery("")}
        >
          <Text style={styles.toggleText}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Friends List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E5FF" />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={50} color="#ff4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFriends}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#00E5FF"]}
              tintColor="#00E5FF"
            />
          }
        >
          {/* Friends List */}
          <View style={styles.friendsContainer}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <FriendItem
                  key={friend.user_id}
                  friend={friend}
                  onReact={handleReactToFriend}
                  onMessage={handleMessageFriend}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="users" size={50} color="#999" />
                <Text style={styles.emptyStateText}>No friends found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery
                    ? "Try a different search term"
                    : "Add some friends to see their activity"}
                </Text>
              </View>
            )}
          </View>

          {/* Suggested Friends section could be added here */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    margin: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  friendsContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#00E5FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#030303",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  emptyStateSubtext: {
    color: "#999",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: "#00E5FF",
  },
  inactiveToggle: {
    backgroundColor: "#1A1A1A",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FriendsPage;
