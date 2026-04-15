import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const workout = () => {
  return (
    <View style={styles.container}>
      <Text>workout</Text>
    </View>
  )
}

export default workout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
})