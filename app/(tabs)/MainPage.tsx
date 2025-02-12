import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Image, Text } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"

const MainPage = () => {
  const avatars = [1, 2, 3, 4] // Array for avatar circles
  const cards = [1, 2, 3] // Array for content cards
  const tabItems = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "heart", label: "Favorites" },
    { icon: "user", label: "Profile" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Image 
                source={require('../../assets/images/EchoesLogo.png')} 
                style={styles.logo}
        />
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
      </ScrollView>

      {/* Bottom container */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: "#2A2A2A",
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
  bottomPadding: {
    height: 140, // Increased space for bottom container
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

export default MainPage

