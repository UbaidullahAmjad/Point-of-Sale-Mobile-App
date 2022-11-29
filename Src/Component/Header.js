import { View, Text } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Header() {
  return (
    <View style={{
      width: wp('100%'),
      height: hp('8%'),
      backgroundColor: '#F36292',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: hp('3.2%'), color: '#fff', fontWeight: 'bold' }}>Royal Dounts POS</Text>
    </View>
  )
}