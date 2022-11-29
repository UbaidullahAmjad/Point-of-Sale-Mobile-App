import { View, Text , ActivityIndicator } from 'react-native'
import React from 'react'

export default function Splash() {
  return (
    <View style={{
        backgroundColor:'black',
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }}>
      <ActivityIndicator size={'large'} color='#fff' />
    </View>
  )
}