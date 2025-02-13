"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Text, Switch } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)

  const tabItems = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "heart", label: "Favorites" },
    { icon: "user", label: "Profile" },
  ]

  const renderSettingItem = (icon, title, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Feather name={icon} size={20} color="#fff" style={styles.settingIcon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#2fb201" }}
        thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {renderSettingItem("moon", "Dark Mode", darkMode, setDarkMode)}
          {renderSettingItem("bell", "Notifications", notifications, setNotifications)}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Feather name="globe" size={20} color="#fff" style={styles.settingIcon} />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          {renderSettingItem("lock", "Private Account", privateAccount, setPrivateAccount)}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Feather name="users" size={20} color="#fff" style={styles.settingIcon} />
              <Text style={styles.settingText}>Blocked Users</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Feather name="key" size={20} color="#fff" style={styles.settingIcon} />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Feather name="shield" size={20} color="#fff" style={styles.settingIcon} />
              <Text style={styles.settingText}>Two-Factor Authentication</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Bottom Padding for Content */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
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
  pageTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    color: "#00E5FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 10,
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomPadding: {
    height: 140,
  },
})

export default SettingsPage

