"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Image,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { RelativePathString, Router, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import getAPI from "../(tabs)/Ngrok";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = getAPI();

async function checkAuthStatus(state: string, router: Router) {
  const interval = 2000; // Poll every 2 seconds
  const maxAttempts = 10; // Stop after 20 seconds
  let attempts = 0;

  const poll = setInterval(async () => {
    try {
      const response = await fetch(
        "https://select-sheep-currently.ngrok-free.app/api/check-auth-status?state=" +
          state,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        clearInterval(poll); // Stop polling
        console.log("Authentication succeeded:", data);
        await AsyncStorage.multiSet([
          ["access_token", data.token],
          ["refresh_token", data.refresh_token],
        ]);
        router.push("(tabs)/MainPage");
      } else if (data.status === "failure") {
        clearInterval(poll); // Stop polling
        console.error("Authentication failed:", data);
        alert("Login failed. Please try again.");
      }
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(poll); // Stop polling after max attempts
        console.error("Authentication timed out.");
        alert("Login timed out. Please try again.");
      }
    } catch (error) {
      console.error("Error during polling:", error);
    }
  }, interval);
}

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {
      username: !username.trim(),
      password: !password.trim(),
    };
    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const shakeField = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSpotifyLogin = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(API_URL + "/spotifylogin", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data) {
        const url: string = data["authorization_url"];
        const state = data["state"];
        console.log("is here");
        if (state) {
          console.log("is here");

          checkAuthStatus(state, router);
        }
        router.push(url as RelativePathString);

      } else {
        throw new Error("Authorization URL not received.");
      }
    } catch (err) {
      Alert.alert(
        "Login Failed",
        err instanceof Error ? err.message : "An unexpected error occurred.",
        [{ text: "Try Again" }]
      );
      shakeField();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      shakeField();
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Success handling
      Alert.alert("Success", "Login successful!", [
        {
          text: "Continue",
        },
      ]);

      router.push("/MainPage");
    } catch (err) {
      Alert.alert(
        "Login Failed",
        err instanceof Error ? err.message : "An unexpected error occurred.",
        [{ text: "Try Again" }]
      );
      shakeField();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/EchoesLogo.png")}
            style={styles.logo}
          />
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>login:</Text>

          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ translateX: shakeAnimation }] },
              errors.username && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="username:"
              placeholderTextColor="#999"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: false }));
              }}
            />
            {errors.username && (
              <Text style={styles.errorText}>Username is required</Text>
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ translateX: shakeAnimation }] },
              errors.password && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: false }));
              }}
            />
            {errors.password && (
              <Text style={styles.errorText}>Password is required</Text>
            )}
          </Animated.View>

          {/* Remember me */}
          <View style={styles.rememberMe}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: "#444", true: "#00E5FF" }}
              thumbColor={rememberMe ? "#fff" : "#fff"}
            />
            <Text style={styles.termsText}>Remember Me?</Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.socialButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.socialButtonText}>Loading...</Text>
            ) : (
              <>
                <View style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Login</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgotText}>forgot username? password?</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <Text style={styles.loginWithText}>login with:</Text>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleSpotifyLogin}
            >
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
            <TouchableOpacity onPress={() => router.push("(tabs)/SignUpPage")}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 15,
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
  inputError: {
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
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
  buttonDisabled: {
    opacity: 0.7,
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
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  termsText: {
    color: "#fff",
    marginLeft: 10,
  },
  socialIcon: {
    backgroundColor: "#fff",
  },
});
