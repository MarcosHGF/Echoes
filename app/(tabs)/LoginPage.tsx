"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo} />
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>login:</Text>

        <TextInput
          style={styles.input}
          placeholder="username:"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotText}>forgot username? password?</Text>
        </TouchableOpacity>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <Text style={styles.loginWithText}>login with:</Text>

          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Spotify</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.noAccountText}>don't have a account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupText}>Sing up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#2A2A2A",
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: "#fff",
  },
  forgotText: {
    color: "#00E5FF",
    textAlign: "center",
    marginTop: 10,
  },
  socialContainer: {
    marginTop: 40,
  },
  loginWithText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: "#2A2A2A",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  socialIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#444",
    marginRight: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  noAccountText: {
    color: "#fff",
  },
  signupText: {
    color: "#00E5FF",
  },
})

