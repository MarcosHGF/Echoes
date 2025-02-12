"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Image } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/EchoesLogo.png')} 
          style={styles.logo}
        />
        <View style={styles.logo} />
      </View>

      {/* Sign Up Form */}
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>SingUp:</Text>

        <TextInput
          style={styles.input}
          placeholder="username:"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email:"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password:"
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
          <Text style={styles.termsText}>Accept term and conditions?</Text>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.haveAccountText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Log in</Text>
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  termsText: {
    color: "#fff",
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  haveAccountText: {
    color: "#fff",
  },
  loginText: {
    color: "#00E5FF",
  },
})

