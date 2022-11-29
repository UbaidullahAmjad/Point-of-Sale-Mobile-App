import { Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ProductBelowButton(props) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={props.onpress}
            style={{
                backgroundColor: "white",
                borderRadius: 10,
                height: hp('10%'),
                width: wp('13%'),
                borderColor: props.value == true ? '#28A745' : 'white',
                borderWidth: wp('0.3%'),
                elevation: 5,
                marginVertical: wp('1%'),
                marginLeft: props.index == '0' ? wp('0.1%') : wp('0.7%'),
                marginRight: props.index == '0' ? wp('0.7%') : wp('0.7%'),
                justifyContent: "center",
                alignItems: "center"
            }}>
            {/* <Image
                source={{ uri: `https://ecco.royaldonuts.xyz/images/Category/${props?.ImageSource}` }}
                style={{ height: hp('4%'), width: wp('2.2%'), margin: wp('0.4%') }} /> */}
            <Text style={{
                fontWeight: "bold",
                color: props.value == true ? '#ABB7B3' : "#ABB7B3",
                fontSize: hp('2.3%'),
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: -1, height: 1.1 },
                textShadowRadius: 1,
            }}>
                {props?.title}
            </Text>
        </TouchableOpacity>
    )
}
