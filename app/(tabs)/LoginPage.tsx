"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Image, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [RemeberMe, setRemeberMe] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "fill all the blank fields.")
      return
    }
    Alert.alert("Login", `Username: ${username}\nPassword: ${password}`)

    setError("")

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json() // Parsing JSON response

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.")
      }

      // Handle successful login (e.g., store token, navigate)
      Alert.alert("Success", `Welcome, ${data.username}!`)
      console.log("Token:", data.token)

      // Example: Navigate to another screen upon successful login
      navigation.navigate("MainPage", { user: data })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/EchoesLogo.png")} style={styles.logo} />
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

        {/* Remember me */}
        <View style={styles.RememberMe}>
          <Switch
            value={RemeberMe}
            onValueChange={setRemeberMe}
            trackColor={{ false: "#444", true: "#00E5FF" }}
            thumbColor={RemeberMe ? "#fff" : "#fff"}
          />
          <Text style={styles.termsText}>Remember Me?</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotText}>forgot username? password?</Text>
        </TouchableOpacity>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <Text style={styles.loginWithText}>login with:</Text>

          <TouchableOpacity style={styles.socialButton}>
            <Feather name="music" size={24} color="#fff" />
            <Text style={styles.socialButtonText}>Spotify</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Feather name="chrome" size={24} color="#fff" />
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
    backgroundColor: "#030303",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 50,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#2A2A2A",
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
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
  RememberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  termsText: {
    color: "#fff",
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: "#2fb201",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
})

