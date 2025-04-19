import { View, StyleSheet } from "react-native"

export default function CustomStatusBar() {
  return (
    <View style={styles.container}>
      {/* Empty container, all content removed */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
})

