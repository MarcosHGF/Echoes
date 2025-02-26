"use client";

import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import BottomContainer from "../../components/BottomContainer";
import PostList from "@/components/PostList" // Import the PostList component

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const trendingTopics = [
    "Summer Hits 2025",
    "Indie Rock Revival",
    "AI-Generated Melodies",
    "Virtual Concert Experiences",
    "Retro Synth Wave",
  ];
  const playlists = [
    { name: "Top 50 Global", image: "/placeholder.svg?height=80&width=80" },
    { name: "Viral Hits", image: "/placeholder.svg?height=80&width=80" },
    { name: "Chill Vibes", image: "/placeholder.svg?height=80&width=80" },
    {
      name: "Workout Motivation",
      image: "/placeholder.svg?height=80&width=80",
    },
  ];
  const tweets = [
    {
      user: "MusicLover",
      content: "Just discovered an amazing new artist! #NewMusic",
      time: "2h ago",
    },
    {
      user: "ConcertGoer",
      content:
        "Last night's virtual concert was mind-blowing! 🎶🤯 #VirtualConcert",
      time: "5h ago",
    },
    {
      user: "PlaylistMaker",
      content:
        "Curated a perfect summer playlist. Who wants to listen? 🏖️🎧 #SummerVibes",
      time: "1d ago",
    },
  ];

  const profileUserId = 1 // Example user ID for the profile

  const handleEllipsisPress = (index: number) => {
    setSelectedPost(selectedPost === index ? null : index);
  };

  const handleOptionSelect = (option: string) => {
    // Handle the selected option here
    console.log(`Selected option: ${option}`);
    setSelectedPost(null);
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Feather
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for songs, artists, or podcasts"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.content}>
          {/* Trending Topics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Topics</Text>
            {trendingTopics.map((topic, index) => (
              <TouchableOpacity key={index} style={styles.trendingItem}>
                <Feather name="trending-up" size={16} color="#00E5FF" />
                <Text style={styles.trendingText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Playlists of the Moment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Playlists of the Moment</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.playlistsContainer}
            >
              {playlists.map((playlist, index) => (
                <TouchableOpacity key={index} style={styles.playlistItem}>
                  <Image
                    source={{ uri: playlist.image }}
                    style={styles.playlistImage}
                  />
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recent Tweets */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trend Tweets</Text>
            <PostList userId={profileUserId} />
          </View>

          {/* Bottom Padding for Content */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
      {/* Bottom Fixed Container */}
      <BottomContainer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  trendingText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  playlistsContainer: {
    flexDirection: "row",
  },
  playlistItem: {
    marginRight: 15,
    alignItems: "center",
    width: 100,
  },
  playlistImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  playlistName: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
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

export default SearchPage;
