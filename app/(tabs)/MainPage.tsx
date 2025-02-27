"use client";

import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import BottomContainer from "../../components/BottomContainer";
import { router } from "expo-router";
import { useState } from "react";
import PostList from "@/components/PostList"; // Import the PostList component

const MainPage = () => {
  const stories = [1, 2, 3, 4, 5]; // Array for stories
  const songs = [1, 2, 3, 4]; // Array for song blocks
  const posts = [1, 2, 3, 4]; // Array for posts
  const tabItems = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "heart", label: "Favorites" },
    { icon: "user", label: "Profile" },
  ];
  const data = 0;
  const profileUserId = 1; // Example user ID for the profile

  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const handleEllipsisPress = (index: number) => {
    setSelectedPost(selectedPost === index ? null : index);
  };

  const handleOptionSelect = (option: string) => {
    // Handle the selected option here
    console.log(`Selected option: ${option}`);
    setSelectedPost(null);
  };

  const handleUserRedirect = async () => {
    router.navigate("/ProfilePage");
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {/* Top Navigation */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/EchoesLogo.png")}
            style={styles.logo}
          />
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          {/* Stories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesContainer}
          >
            {stories.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "(tabs)/StoriesPage",
                    params: { initialStoryId: index + 1 },
                  })
                }
              >
                <View style={styles.story}>
                  <View style={styles.storyRing}>
                    <View style={styles.storyImage} />
                  </View>
                  <Text style={styles.storyText}>User {index + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Song Blocks */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Popular Songs</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.songsContainer}
          >
            {songs.map((_, index) => (
              <View key={index} style={styles.songBlock}>
                <View style={styles.songImage} />
                <Text style={styles.songTitle}>Song {index + 1}</Text>
                <Text style={styles.songArtist}>Artist {index + 1}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Posts */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Latest Posts</Text>
          </View>
          <PostList userId={profileUserId} />
        </ScrollView>
      </SafeAreaView>
      <BottomContainer />
    </>
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
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  storiesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  story: {
    alignItems: "center",
    marginRight: 15,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#00E5FF",
    justifyContent: "center",
    alignItems: "center",
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
  sectionTitle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  songsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  songBlock: {
    width: 120,
    marginRight: 15,
  },
  songImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
  },
  songTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  songArtist: {
    color: "#999",
    fontSize: 12,
  },
  post: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
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
});

export default MainPage;
