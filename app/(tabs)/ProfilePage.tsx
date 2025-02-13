import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Text, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"
import BottomContainer from "../../components/BottomContainer"

const ProfilePage = () => {
  const playlists = [1, 2, 3, 4, 5] // Array for playlists
  const stories = [1, 2, 3, 4, 5] // Array for stories
  const tweets = [1, 2, 3] // Array for tweets
  const tabItems = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "heart", label: "Favorites" },
    { icon: "user", label: "Profile" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.content}>
        {/* Banner and Profile Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner} />
          <View style={styles.profileSection}>
            <View style={styles.profilePictureContainer}>
              <Image source={require("../../assets/images/profile-picture.png")} style={styles.profilePicture} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Calcifer</Text>
              <View style={styles.currentlyPlayingContainer}>
                <Text style={styles.currentlyPlaying}>
                  <Feather name="music" size={14} color="#00E5FF" /> Currently playing: Song Name
                </Text>
                <TouchableOpacity style={styles.listButton} onPress={() => console.log("List song")}>
                  <Feather name="list" size={14} color="#00E5FF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* User Description */}
        <View style={styles.section}>
          <Text style={styles.userDescription}>Music enthusiast | Playlist curator | Always exploring new sounds</Text>
        </View>

        {/* Favorite Music Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Music</Text>
          <View style={styles.favoriteMusicContainer}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.favoriteMusicItem}>
                <View style={styles.favoriteMusicCover} />
                <Text style={styles.favoriteMusicTitle}>Top Song {index + 1}</Text>
                <Text style={styles.favoriteMusicArtist}>Artist {index + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Playlists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Playlists</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playlistsContainer}>
            {playlists.map((_, index) => (
              <View key={index} style={styles.playlistItem}>
                <View style={styles.playlistCover} />
                <Text style={styles.playlistTitle}>Playlist {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Stories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
            {stories.map((_, index) => (
              <View key={index} style={styles.storyItem}>
                <View style={styles.storyRing}>
                  <View style={styles.storyImage} />
                </View>
                <Text style={styles.storyText}>Story {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tweets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tweets</Text>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.post}>
              <View style={styles.postHeader}>
                <View style={styles.postAvatar} />
                <View>
                  <Text style={styles.postUsername}>User {index + 1}</Text>
                  <Text style={styles.postTime}>2h ago</Text>
                </View>
              </View>
              <Text style={styles.postContent}>This is a sample tweet about music, life, or anything else!</Text>
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postAction}>
                  <Feather name="heart" size={20} color="#fff" />
                  <Text style={styles.postActionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Feather name="message-circle" size={20} color="#fff" />
                  <Text style={styles.postActionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Feather name="share-2" size={20} color="#fff" />
                  <Text style={styles.postActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Padding for Content */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Fixed Container */}
      <BottomContainer />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
  },
  content: {
    flex: 1,
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
  tweetItem: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  tweetContent: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  tweetTime: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },
  bottomPadding: {
    height: 140,
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
    marginBottom: 10,
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
})

export default ProfilePage

