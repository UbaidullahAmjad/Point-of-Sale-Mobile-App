import { Text, TouchableHighlight, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function OrderCustomButtom(props) {
    return (
        <TouchableHighlight
            underlayColor={props.color}
            onPress={props.onpress}
            onPressIn={props.onpressin}
            onPressOut={props.onpressout}
            style={{
                backgroundColor: "white",
                borderRadius: 10,
                height: hp('5%'),
                width: wp('8%'),
                borderColor: props.color,
                borderWidth: 2,
                elevation: 5,
                marginHorizontal: props.title == 'Cancel Order' ? wp('1%') : 0,
                justifyContent: "center",
                marginVertical: hp('0.8%'),
                alignItems: "center"
            }}>
            {props?.loader ? (
                <ActivityIndicator color={props.color} size='small' />
            ) :
                <Text style={{ color: props.valueHighlight ? 'white' : props.color, fontSize: hp('2%'), fontWeight: "bold" }}>
                    {props?.title}
                </Text>
            }

        </TouchableHighlight >
    )
}
