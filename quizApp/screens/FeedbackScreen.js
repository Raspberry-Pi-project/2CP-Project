"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { Feather } from "@expo/vector-icons"

export default function FeedbackScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [section, setSection] = useState("")
  const [group, setGroup] = useState("")
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    // Here you would handle the feedback submission
    alert("Feedback submitted successfully!")
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feedback</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Share Your Feedback</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Section</Text>
              <TextInput
                style={styles.input}
                value={section}
                onChangeText={setSection}
                placeholder="Enter your section"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Group</Text>
              <TextInput style={styles.input} value={group} onChangeText={setGroup} placeholder="Enter your group" />
            </View>

            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackInstructions}>please write your feed back down below</Text>
              <TextInput
                style={styles.feedbackInput}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Describe your experience here"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>

            <View style={styles.supportContainer}>
              <Text style={styles.quickSupport}>Quick Support</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7768E5", // Updated from "#29B6F6" to "#7768E5"
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    padding: 20,
    minHeight: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
    fontSize: 16,
  },
  feedbackContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  feedbackInstructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    height: 150,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#7768E5", // Updated from "#03A9F4" to match the header
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  supportContainer: {
    alignItems: "flex-end",
  },
  quickSupport: {
    color: "#7768E5", // Updated from "#03A9F4" to match the header
    fontSize: 14,
  },
})
