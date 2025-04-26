"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import axios from "axios";
import { studentAPI } from "../services/api";
import { colors } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { API_URL } from "../services/config";

const { width } = Dimensions.get("window");

// Centralized theme colors
const COLORS = {
  primary: colors.primary || "#A42FC1", // Using the colors from constants, with fallback
  secondary: "#4fc3f7",
  background: "#F8F9FA",
  cardBackground: "#ffffff",
  text: {
    dark: "#333333",
    medium: "#666666",
    light: "#888888",
    white: "#ffffff",
  },
  error: "#d32f2f",
  divider: "#f0f0f0",
  danger: "#FF3B30",
};

// Centralized typography
const TYPOGRAPHY = {
  fontFamily: Platform.select({
    web: "Roboto, Arial, sans-serif",
    ios: "System",
    android: "Roboto",
  }),
  sizes: {
    small: 12,
    medium: 14,
    regular: 16,
    large: 18,
    xlarge: 24,
  },
  weights: {
    normal: Platform.select({ web: "400", native: "normal" }),
    medium: Platform.select({ web: "500", native: "500" }),
    bold: Platform.select({ web: "700", native: "bold" }),
  },
};

// Centralized spacing
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 30,
};

// Centralized shadows
const SHADOWS = Platform.select({
  web: {
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default function ProfileScreen({ navigation }) {
  // Simple state management - no backend connections
  const [name, setName] = useState("Melissa Peters");
  const [email, setEmail] = useState("mepeters@gmail.com");
  const [yearOfStudy, setYearOfStudy] = useState("3");
  const [groupe, setGroupe] = useState("Group A");
  const [studentId, setStudentId] = useState("STU12345");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const cardAnim1 = useRef(new Animated.Value(0)).current;
  const cardAnim2 = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchUserData = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");
        const user = await axios.post(
          `${API_URL}/students/profile`,
          { id_student: parseInt(userId), page: 1, limit: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(user.data.data[0]);
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("User Data: ", userData);
  }, [userData]);

  // Make sure header is hidden when component mounts
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Start animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(avatarAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(200, [
        Animated.timing(cardAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [navigation, fadeAnim, avatarAnim, cardAnim1, cardAnim2, buttonAnim]);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Clear all data from AsyncStorage
      await AsyncStorage.clear();
      // Navigate to Login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still navigate to Login even if clearing storage fails
      navigation.navigate("Login");
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    const nameParts = name.split(" ");
    const first = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
    const last =
      nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return first + last;
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
      {/* Explicitly hide status bar */}
      <StatusBar hidden />

      {/* Back Button */}
      <Animated.View
        style={[
          styles.backButtonContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Profile Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              opacity: avatarAnim,
              transform: [
                {
                  scale: avatarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                {
                  translateY: avatarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {isLoading ? "" : userData.last_name[0] + userData.first_name[0]}
            </Text>
          </View>
          <Text style={styles.nameText}>
            {userData.last_name + " " + userData.first_name}
          </Text>
        </Animated.View>

        {/* Content Cards */}
        <View style={styles.cardsContainer}>
          {/* Personal Information Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardAnim1,
                transform: [
                  {
                    translateX: cardAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Icon name="account-details" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Icon
                  name="account"
                  size={20}
                  color={COLORS.text.medium}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>
                    {userData.last_name + " " + userData.first_name}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  name="email"
                  size={20}
                  color={COLORS.text.medium}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userData.email}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Academic Information Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardAnim2,
                transform: [
                  {
                    translateX: cardAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Icon name="school" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Academic Information</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Icon
                  name="calendar-clock"
                  size={20}
                  color={COLORS.text.medium}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Year of Study</Text>
                  <Text style={styles.infoValue}>{userData.annee}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  name="account-group"
                  size={20}
                  color={COLORS.text.medium}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Groupe</Text>
                  <Text style={styles.infoValue}>
                    {userData.groupe_student}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  name="identifier"
                  size={20}
                  color={COLORS.text.medium}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Student ID</Text>
                  <Text style={styles.infoValue}>{userData.id_student}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View
            style={{
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Icon name="logout" size={20} color={COLORS.text.white} />
              <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButtonContainer: {
    position: "absolute",
    top: SPACING.xl,
    left: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: SPACING.xl * 2,
    paddingTop: SPACING.xl * 3, // Extra padding at top to account for back button
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: SPACING.xl * 2,
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.white,
  },
  nameText: {
    fontSize: TYPOGRAPHY.sizes.xlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.dark,
    marginTop: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  cardsContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: SPACING.md,
    ...SHADOWS,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  cardContent: {
    padding: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoIcon: {
    marginRight: SPACING.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.text.medium,
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.sizes.regular,
    color: COLORS.text.dark,
    fontWeight: TYPOGRAPHY.weights.medium,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  logoutText: {
    color: COLORS.text.white,
    fontSize: TYPOGRAPHY.sizes.regular,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginLeft: SPACING.xs,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
});
