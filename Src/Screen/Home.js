import React from 'react'
import { View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import InvoiceDetail from '../Component/InvoiceDetail'
import ProductList from '../Component/ProductList'

export default function Home() {
    return (
        <View style={{ flex: 1 }}>
            {/* <Header /> */}
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <View style={{ height: '100%', width: wp('70%') }}>
                    <ProductList />
                </View>
                <View style={{ height: '100%', width: wp('30%') }}>
                    <InvoiceDetail />
                </View>
            </View>
        </View>
    )
}