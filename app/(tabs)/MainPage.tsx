import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"

const MainPage = () => {
  const avatars = [1, 2, 3, 4] // Array for avatar circles
  const cards = [1, 2, 3] // Array for content cards
  const tabItems = ["home", "search", "list", "user"] // Icons for bottom tab

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Avatars Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarsContainer}>
          {avatars.map((_, index) => (
            <TouchableOpacity key={index} style={styles.avatar} />
          ))}
        </ScrollView>

        {/* Content Cards */}
        <View style={styles.cardsContainer}>
          {cards.map((_, index) => (
            <View key={index} style={styles.card} />
          ))}
        </View>

        {/* Bottom Action Button */}
        <TouchableOpacity style={styles.actionButton} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {tabItems.map((icon, index) => (
          <TouchableOpacity key={index} style={styles.tabItem}>
            <Feather name={icon} size={24} color="#fff" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingBottom: 15,
  },
  content: {
    flex: 1,
  },
  avatarsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
    marginRight: 15,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    height: 120,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 15,
  },
  actionButton: {
    height: 50,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 100, // Space for bottom tab bar
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  tabItem: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default MainPage

