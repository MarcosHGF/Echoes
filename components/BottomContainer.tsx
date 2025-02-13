import { View, TouchableOpacity, StyleSheet, Text, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"

const BottomContainer = () => {
  const tabItems = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "heart", label: "Favorites" },
    { icon: "user", label: "Profile" },
  ]

  return (
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
  )
}

const styles = StyleSheet.create({
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

export default BottomContainer

