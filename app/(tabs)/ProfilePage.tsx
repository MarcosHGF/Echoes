"use client";

import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BottomContainer from "../../components/BottomContainer";
import { router, useLocalSearchParams } from "expo-router";
import PostList from "@/components/PostList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getAPI from "@/app/(tabs)/Ngrok";
import apiClient from "../utils/aptClient";

// Define the profile data interface based on the backend response
interface ProfileData {
  id: number;
  name: string;
  username: string;
  pfp: string | null;
  musics: string[] | null;
}

const { width, height } = Dimensions.get("window");

const ProfilePage = () => {
  const params = useLocalSearchParams();
  console.log(params);
  const username = (params.user as string) || null; // Get username from route params, or null if not provided

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const API_URL = getAPI();

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // If username is provided, fetch that specific user's profile
      // If not, fetch the current user's profile
      const endpoint = `${API_URL}/profile/${username}`;

      if (username == "me") {
        setIsOwnProfile(true);
      }

      const response = await apiClient.get(endpoint);

      if (response.status != 200) {
        const errorData = await response.data;
        throw new Error(errorData.error || "Failed to fetch profile data");
      }

      const data = await response.data;
      setProfileData(data);

      // Only check follow status if it's not the user's own profile
      if (!isOwnProfile) {
        // Check if we're following this user (this would be a separate API call)
        // checkFollowStatus(data.id);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle follow status
  const toggleFollow = async () => {
    if (!profileData || isOwnProfile) return;

    try {
      setLoading(true);

      const response = await apiClient.get(`/api/follow/${profileData.id}`);

      if (response.status != 200) {
        throw new Error("Failed to update follow status");
      }

      // Toggle the follow status
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to edit profile screen
  const navigateToEditProfile = () => {
    router.push("/EditProfilePage");
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  if (loading && !profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E5FF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchUserProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner and Profile Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}></View>
          <View style={styles.profileSection}>
            <View style={styles.profilePictureContainer}>
              <Image
                source={{
                  uri: profileData?.pfp || "https://via.placeholder.com/84",
                }}
                style={styles.profilePicture}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profileData?.name || "Loading..."}
              </Text>
              <Text style={styles.username}>
                @{profileData?.username || "username"}
              </Text>

              {profileData?.musics && profileData.musics.length > 0 && (
                <TouchableOpacity
                  style={styles.currentlyPlayingContainer}
                  onPress={() => console.log("List song")}
                >
                  <Text style={styles.currentlyPlaying}>
                    Currently playing: {profileData.musics[0]}
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color="#00E5FF"
                    style={styles.listButton}
                  />
                </TouchableOpacity>
              )}

              {isOwnProfile ? (
                // Edit Profile button for own profile
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={navigateToEditProfile}
                >
                  <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              ) : (
                // Follow/Following button for other profiles
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    isFollowing && styles.followingButton,
                  ]}
                  onPress={toggleFollow}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={isFollowing ? "#00E5FF" : "#000"}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.followButtonText,
                        isFollowing && styles.followingButtonText,
                      ]}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
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
        {profileData?.musics && profileData.musics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Music</Text>
            <View style={styles.favoriteMusicContainer}>
              {profileData.musics.slice(0, 3).map((music, index) => (
                <View key={index} style={styles.favoriteMusicItem}>
                  <View style={styles.favoriteMusicCover}></View>
                  <Text style={styles.favoriteMusicTitle}>{music}</Text>
                  <Text style={styles.favoriteMusicArtist}>Artist</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Playlists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Playlists</Text>
          <View style={styles.playlistsContainer}>
            {[1, 2, 3, 4, 5].map((_, index) => (
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
            {[1, 2, 3, 4, 5].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={styles.storyItem}
                onPress={() =>
                  router.push({
                    pathname: "/StoriesPage",
                    params: {
                      initialStoryId: index + 1,
                      userId: profileData?.username || "user",
                    },
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
          {profileData && <PostList userId={profileData.id} />}
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
    backgroundColor: "#2A2A2A", // Placeholder color while loading
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    color: "#999",
    fontSize: 14,
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
    flexWrap: "nowrap",
    overflow: "scroll",
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
    flexWrap: "nowrap",
    overflow: "scroll",
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
  followButton: {
    backgroundColor: "#00E5FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    minWidth: 85,
    alignItems: "center",
  },
  followButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00E5FF",
  },
  followingButtonText: {
    color: "#00E5FF",
  },
  editProfileButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00E5FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    minWidth: 100,
    alignItems: "center",
  },
  editProfileButtonText: {
    color: "#00E5FF",
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 140,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#f85149",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00E5FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default ProfilePage;
