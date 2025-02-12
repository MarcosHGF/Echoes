import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Text } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"

const ProfilePage = () => {
  const musicItems = [1, 2, 3] // Array for music items
  const gridItems = [1, 2, 3] // Array for grid items
  const tabItems = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "heart", label: "Favorites" },
    { icon: "user", label: "Profile" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Banner and Profile Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner} />
          <View style={styles.profileSection}>
            <View style={styles.profilePicture} />
            <Text style={styles.profileName}>NAME</Text>
          </View>
        </View>

        {/* Music Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>musica</Text>
          <View style={styles.musicContainer}>
            {musicItems.map((_, index) => (
              <View key={index} style={styles.musicItem}>
                <View style={styles.musicBar} />
                <View style={styles.musicControls}>
                  <View style={styles.musicControl} />
                  <View style={styles.musicControl} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.separator} />

        {/* Grid Section */}
        <View style={styles.gridContainer}>
          {gridItems.map((_, index) => (
            <View key={index} style={styles.gridItem} />
          ))}
        </View>

        <View style={styles.separator} />

        {/* Bottom Padding for Content */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Fixed Container */}
      <View style={styles.bottomContainer}>
        {/* Action Button */}
        <View style={styles.actionButton}>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonText}>What's on your mind?</Text>
            <TouchableOpacity style={styles.playButton}>
              <Feather name="play" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          {tabItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.tabItem}>
              <Feather name={item.icon} size={24} color="#fff" />
              <Text style={styles.tabLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    marginBottom: 20,
  },
  banner: {
    height: 150,
    backgroundColor: "#2A2A2A",
    marginBottom: 40,
  },
  profileSection: {
    position: "absolute",
    bottom: -20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    marginRight: 15,
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 15,
  },
  musicContainer: {
    gap: 15,
  },
  musicItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 8,
  },
  musicBar: {
    height: 8,
    width: "70%",
    backgroundColor: "#444",
    borderRadius: 4,
  },
  musicControls: {
    flexDirection: "row",
    gap: 10,
  },
  musicControl: {
    width: 24,
    height: 24,
    backgroundColor: "#444",
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 20,
  },
  gridContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
  },
  bottomPadding: {
    height: 140,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    height: 50,
    backgroundColor: "#2fb201",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  actionButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  playButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
  },
  tabItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  tabLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
})

export default ProfilePage

