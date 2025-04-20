"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
} from "react-native";
import { colors } from "../constants/colors";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter both email and password");
      return;
    }

    try {
      console.log("Attempting login to:", "http://172.20.10.2:3000/auth/login");
      console.log("Request Payload:", { email, password, role: "student" });

      // Step 1: Login and get userId
      const response = await axios.post(
        "http://172.20.10.2:3000/auth/login",
        {
          email,
          password,
          role: "student",
        },
        { timeout: 10000 } // 10 seconds timeout
      );

      console.log("Response:", response.data);

      const { userId, role, message } = response.data;

      if (!userId) {
        alert("Login failed: No userId received.");
        return;
      }

      console.log("Login successful:", message);
      console.log("User ID:", userId);

      // Save userId and role to AsyncStorage
      await AsyncStorage.setItem("userId", userId.toString());
      await AsyncStorage.setItem("userRole", role);

      // Step 2: Fetch additional details using userId
      const userDetailsResponse = await axios.post(
        `http://172.20.10.2:3000/students/${userId}`
      );
// jknjkn
      const { groupe_student: studentGroup, annee: studentYear } =
        userDetailsResponse.data;

      if (!studentGroup || !studentYear) {
        alert("Failed to fetch student details.");
        return;
      }

      console.log("Student Group:", studentGroup);
      console.log("Student Year:", studentYear);

      // Save studentGroup and studentYear to AsyncStorage
      await AsyncStorage.setItem("studentGroup", studentGroup.toString());
      await AsyncStorage.setItem("studentYear", studentYear.toString());

      // Step 3: Navigate to the Home screen
      alert("Login successful");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        alert(`Login failed: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Server is not responding. Check your connection or server status.");
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }

    if (rememberMe) {
      await AsyncStorage.setItem("rememberedEmail", email);
      await AsyncStorage.setItem("rememberedPassword", password);
    }
  };

  const handleCreateAccount = () => {
    // Navigate to signup screen
    navigation.navigate("Signup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M15 18l-6-6 6-6"
                    stroke={colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>LOG IN</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")} // Update path to your image
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                Enter your log in details to access your account
              </Text>

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
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.rememberContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Svg
                        width={12}
                        height={12}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <Path
                          d="M20 6L9 17l-5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Remember Me?</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>
                  Log In With Your Account
                </Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't Have An Account?</Text>
                <TouchableOpacity onPress={handleCreateAccount}>
                  <Text style={styles.signupLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    height: 74, // Match image height
  },
  logoImage: {
    width: 274, // Image width from dimensions
    height: 74, // Image height from dimensions
  },
  formContainer: {
    width: "100%",
  },
  formTitle: {
    fontSize: 16,
    color: "#FF6B6B",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
  },
  forgotPassword: {
    fontSize: 14,
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  signupLink: {
    fontSize: 14,
    color: "#4ADE80",
    fontWeight: "600",
  },
});