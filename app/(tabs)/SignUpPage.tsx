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
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import getAPI from ".";

const API_URL = getAPI();

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword || !email || !acceptTerms) {
      Alert.alert("Error", "fill all the blank fields.");
      return;
    }

    if (password != confirmPassword) {
      Alert.alert("Senhas são diferentes");
      return;
    }

    try {
      const response = await fetch("API_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json(); // Parsing JSON response

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      router.push("/MainPage");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
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

        {/* Sign Up Form */}
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Sign Up:</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: "#444", true: "#00E5FF" }}
              thumbColor={acceptTerms ? "#fff" : "#fff"}
            />
            <Text style={styles.termsText}>Accept terms and conditions</Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.haveAccountText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/LoginPage")}>
              <Text style={styles.loginText}>Log in</Text>
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
    fontSize: 28,
    fontWeight: "bold",
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  termsText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#2fb201",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  haveAccountText: {
    color: "#fff",
    fontSize: 14,
  },
  loginText: {
    color: "#00E5FF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
