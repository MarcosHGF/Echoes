"use client";

import { useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Text, Image, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import BottomContainer from "../../components/BottomContainer";
import { router } from "expo-router";
import PostList from "@/components/PostList"; // Import the PostList component

const { width, height } = Dimensions.get("window");

const ProfilePage = () => {
  const playlists = [1, 2, 3, 4, 5]; // Array for playlists
  const stories = [1, 2, 3, 4, 5]; // Array for stories
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const profileUserId = 1;

  const handleEllipsisPress = (index: number) => {
    setSelectedPost(selectedPost === index ? null : index);
  };

  const handleOptionSelect = (option: string) => {
    // Handle the selected option here
    console.log(`Selected option: ${option}`);
    setSelectedPost(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner and Profile Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}></View>
          <View style={styles.profileSection}>
            <View style={styles.profilePictureContainer}>
              <Image source={{ uri: "https://via.placeholder.com/84" }} style={styles.profilePicture} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Calcifer</Text>
              <TouchableOpacity
                style={styles.currentlyPlayingContainer}
                onPress={() => console.log("List song")}
              >
                <Text style={styles.currentlyPlaying}>Currently playing: Song Name</Text>
                <Feather name="chevron-right" size={16} color="#00E5FF" style={styles.listButton} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Description */}
        <View style={styles.section}>
          <Text style={styles.userDescription}>
            Music enthusiast | Playlist curator | Always exploring new sounds
          </Text>
        </View>

        {/* Favorite Music Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Music</Text>
          <View style={styles.favoriteMusicContainer}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.favoriteMusicItem}>
                <View style={styles.favoriteMusicCover}></View>
                <Text style={styles.favoriteMusicTitle}>Top Song {index + 1}</Text>
                <Text style={styles.favoriteMusicArtist}>Artist {index + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Playlists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Playlists</Text>
          <View style={styles.playlistsContainer}>
            {playlists.map((_, index) => (
              <View key={index} style={styles.playlistItem}>
                <View style={styles.playlistCover}></View>
                <Text style={styles.playlistTitle}>Playlist {index + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stories</Text>
          <View style={styles.storiesContainer}>
            {stories.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={styles.storyItem}
                onPress={() =>
                  router.push({
                    pathname: "/StoriesPage",
                    params: { initialStoryId: index + 1, userId: "Calcifer" },
                  })
                }
              >
                <View style={styles.storyRing}>
                  <View style={styles.storyImage}></View>
                </View>
                <Text style={styles.storyText}>Story {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tweets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tweets</Text>
          {/* Use the PostList component here */}
          <PostList userId={profileUserId} />
        </View>

        {/* Bottom Padding for Content */}
        <View style={styles.bottomPadding}></View>
      </ScrollView>

      {/* Bottom Fixed Container */}
      <BottomContainer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },
  content: {
    flexGrow: 1,
  },
  bannerContainer: {
    position: "relative",
    marginBottom: 60,
  },
  banner: {
    height: 150,
    backgroundColor: "#2A2A2A",
  },
  profileSection: {
    position: "absolute",
    bottom: -50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePictureContainer: {
    borderWidth: 3,
    borderColor: "#00E5FF",
    borderRadius: 45,
    padding: 3,
  },
  profilePicture: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  currentlyPlayingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  currentlyPlaying: {
    color: "#00E5FF",
    fontSize: 14,
  },
  listButton: {
    marginLeft: 10,
    padding: 5,
  },
  section: {
    padding: 20,
  },
  userDescription: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  favoriteMusicContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteMusicItem: {
    alignItems: "center",
    width: "30%",
  },
  favoriteMusicCover: {
    width: 80,
    height: 80,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 8,
  },
  favoriteMusicTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  favoriteMusicArtist: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  playlistsContainer: {
    flexDirection: "row",
  },
  playlistItem: {
    marginRight: 15,
    alignItems: "center",
  },
  playlistCover: {
    width: 120,
    height: 120,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 14,
  },
  storiesContainer: {
    flexDirection: "row",
  },
  storyItem: {
    marginRight: 15,
    alignItems: "center",
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#00E5FF",
    padding: 2,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
  },
  storyText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  post: {
    backgroundColor: "#1A1A1A",
    marginBottom: 20,
    borderRadius: 8,
    padding: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    marginRight: 10,
  },
  postUsername: {
    color: "#fff",
    fontWeight: "bold",
  },
  postTime: {
    color: "#999",
    fontSize: 12,
  },
  postContent: {
    color: "#fff",
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  postActionText: {
    color: "#fff",
    marginLeft: 5,
  },
  ellipsisButton: {
    padding: 5,
  },
  optionsMenu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
  bottomPadding: {
    height: 140,
  },
});

export default ProfilePage;