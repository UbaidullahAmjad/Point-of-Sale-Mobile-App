import React from 'react';
import { FlatList, View } from 'react-native';
import {
    heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const list = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export default function ProductPlaceholder() {
    return (
        <FlatList
            data={list}
            numColumns={4}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginHorizontal: wp('1.8%') }}
            ItemSeparatorComponent={() => {
                return (
                    <View style={{ width: 20 }} />
                )
            }}
            renderItem={({ item, index }) => {
                return (
                    <View style={{
                        height: hp('25%'),
                        width: wp('15%'),
                        marginLeft: wp('1%'),
                        marginVertical: hp('2%')
                    }}>
                        <SkeletonPlaceholder highlightColor="rgba(0,0,0,0.3)"  >
                            <View style={{
                                height: hp('25%'),
                                width: wp('15%'),
                                borderRadius: 5
                            }}>
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                )
            }}
        />
    )
}