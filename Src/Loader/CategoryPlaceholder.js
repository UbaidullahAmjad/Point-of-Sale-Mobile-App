import React from 'react';
import { FlatList, View } from 'react-native';
import {
    heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const list = [1, 2, 3, 4, 6, 7, 8, 9]

export default function CategoryPlaceholder() {
    return (
        <FlatList
            data={list}
            horizontal
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => {
                return (
                    <View style={{ width: 20 }} />
                )
            }}
            renderItem={({ item, index }) => {
                return (
                    <View style={{
                        backgroundColor: "white",
                        borderRadius: 10,
                        height: hp('9%'),
                        width: wp('12%'),
                        elevation: 5,
                        marginVertical: wp('1%'),
                        marginLeft: index == '0' ? wp('0.1%') : wp('0.7%'),
                        marginRight: index == '0' ? wp('0.7%') : wp('0.7%'),
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <SkeletonPlaceholder highlightColor="rgba(0,0,0,0.3)"  >
                            <View style={{
                                height: hp('9%'),
                                width: wp('12%'),
                                borderRadius: 12
                            }}>
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                )
            }}
        />
    )
}