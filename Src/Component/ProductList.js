import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import { connect } from 'react-redux';
import CategoryPlaceholder from '../Loader/CategoryPlaceholder';
import ProductPlaceholder from '../Loader/ProductPlaceholder';
import Draft from '../Screen/Model/Draft';
import Sale from '../Screen/Model/Sale';
import { AddToCart, removeAllItemsToCart } from '../Store/Actions/CartAction';
import { changeCategoryAndGetProduct, DraftFtn, GetAlltheProductToExcel, getMoreData, GetSaleProducts, ViewSaleInvoice } from '../Store/Actions/PRoductAction';
import Drafticon from './Drafticon';
import OrderCustomButtom from './OrderCustomButtom';
import ProductBelowButton from './ProductBelowButton';
import { useNetInfo } from "@react-native-community/netinfo"
let listViewRef;
function ProductList(props) {
    const netInfo = useNetInfo();
    const [buttonState, setButtonState] = React.useState('All Product')
    const [highlightTextColorValue, setHighlightTextColorValue] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)
    const [filterData, setFilterData] = useState([])
    const [searchInputText, setSearchInputText] = useState('')
    const [DesignWithImage, setDesignWithImage] = useState(true)
    const [draftModal, setDraftModal] = useState(false)

    const ButtonPressView = (name) => {
        setButtonState(name)
    }

    const OrderButton = async (name) => {
        if (name == 'Cancel Order') {
            await props?.removeAllItemsToCart()
        }
        else if (name == 'Sales') {
            setModalVisible(true)
            await props?.GetSaleProducts()
            await props?.getMoreData()
        }
        else {
            props?.DraftFtn(netInfo.isConnected)
        }
    }

    const upButtonHandler = () => {
        //OnCLick of Up button we scrolled the list to top
        listViewRef.scrollToOffset({ offset: 0, animated: true });
    };

    const downButtonHandler = () => {
        //OnCLick of down button we scrolled the list to bottom
        listViewRef.scrollToEnd({ animated: true });
    };

    return (
        <View style={styles.MainView}>
            <View style={{
                backgroundColor: "#F6F6F6",
                elevation: 5,
                borderRadius: 10,
                height: '80%',
            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: wp('1%') }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center"
                    }}>
                        <Entypo name='list' size={wp('2%')} color={DesignWithImage ? '#717171' : '#28A745'} onPress={() => setDesignWithImage(false)} />
                        <EvilIcons name='image' size={wp('2.6%')} color={DesignWithImage ? '#28A745' : '#717171'} onPress={() => setDesignWithImage(true)} />
                        <Drafticon onPress={() => setDraftModal(!draftModal)} />
                        <Foundation name='refresh' size={wp('2%')} color={'#717171'} onPress={() => props?.GetAlltheProductToExcel()} style={{ marginLeft: wp('1%') }} />

                    </View>
                    <TextInput
                        placeholder='Search Items here ...'
                        placeholderTextColor={'silver'}
                        style={{ backgroundColor: "#f0f0f0", paddingVertical: hp('1.5%'), width: wp('20%'), height: hp('6%'), fontSize: hp('1.8%'), color: 'black', padding: '2%', borderRadius: 50 }}
                        onChangeText={(text) => {
                            if (text == '') {
                                setFilterData([])
                                setSearchInputText('')
                            } else {
                                let filteredData = props?.Product?.Product.filter((item) => {
                                    return item.name_fr.toLowerCase().includes(text.toLowerCase());
                                });
                                setFilterData(filteredData)
                                setSearchInputText(text)
                            }
                        }}
                    />
                </View>
                <View style={{
                    justifyContent: "center",
                    flex: 1
                }}>
                    {props?.Product?.productLoader ? (
                        <ProductPlaceholder />
                    ) :
                        filterData.length != 0 ?
                            <FlatList
                                data={filterData}
                                numColumns={4}
                                keyExtracto={(item, index) => index}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ marginHorizontal: wp('2%') }}
                                ListFooterComponent={() => {
                                    return (
                                        <View style={{ height: 10 }} />
                                    )
                                }}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => props?.AddToCart(item)}
                                            style={{ paddingHorizontal: wp('1%'), paddingTop: hp('1%'), borderRadius: 10, backgroundColor: "white", elevation: 5, marginLeft: wp('1.5%'), marginVertical: hp('2%') }}>
                                            <Image
                                                resizeMode='stretch'
                                                source={{ uri: `https://ecco.royaldonuts.xyz/images/Product/${item?.image}` }}
                                                style={{
                                                    borderRadius: 5, height: hp('17%'), width: wp('12%'),
                                                }} />
                                            <View style={{ marginVertical: hp('1%'), marginTop: hp('1.5%') }}>
                                                <Text numberOfLines={2} style={{ color: "#515151", fontSize: hp('2.2%'), width: wp('10%'), fontWeight: "bold" }}>{item?.name_fr}</Text>
                                                <Text style={{ color: "#28A745", fontSize: hp('2%'), width: wp('10%'), fontWeight: "bold" }}>{item?.price_euro} TND </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                            :
                            searchInputText != '' ?
                                <Text style={{ textAlign: "center", fontSize: hp('5%'), color: "#757575" }}>No Data Found</Text>
                                :
                                DesignWithImage ? (
                                    <FlatList
                                        key={'#'}
                                        data={props?.Product?.Product}
                                        numColumns={4}
                                        keyExtracto={(item, index) => '#' + index}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ marginHorizontal: wp('2%') }}
                                        ListFooterComponent={() => {
                                            return (
                                                <View style={{ height: 10 }} />
                                            )
                                        }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => props?.AddToCart(item)}
                                                    style={{
                                                        paddingHorizontal: wp('1%'),
                                                        paddingTop: hp('1%'),
                                                        borderRadius: 10,
                                                        backgroundColor: "white",
                                                        elevation: 5,
                                                        marginLeft: wp('1.5%'),
                                                        marginVertical: hp('2%')
                                                    }}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        source={{ uri: `https://ecco.royaldonuts.xyz/images/Product/${item?.image}` }}
                                                        style={{
                                                            borderRadius: 5, height: hp('17%'), width: wp('12%'),
                                                        }} />
                                                    <View style={{
                                                        marginVertical: hp('1%'),
                                                        marginTop: hp('1.5%'),
                                                        justifyContent: "center",
                                                        alignItems: "flex-start"
                                                    }}>
                                                        <Text numberOfLines={2} style={{ color: "#515151", fontSize: hp('2.2%'), width: wp('10%'), textAlign: "left", fontWeight: "bold" }}>{item?.name_fr}</Text>
                                                        <Text style={{ color: "#28A745", fontSize: hp('2%'), width: wp('10%'), textAlign: "left", fontWeight: "bold" }}>{item?.price_euro} TND </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                        ListEmptyComponent={() => {
                                            return (
                                                <View style={{ justifyContent: "center", alignItems: "center", height: heightPercentageToDP('57%') }}>
                                                    <Text>No Product are available!</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                ) :
                                    <FlatList
                                        key={'_'}
                                        data={props?.Product?.Product}
                                        numColumns={5}
                                        keyExtracto={(item, index) => '_' + index}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ marginHorizontal: wp('0.8%') }}
                                        ListFooterComponent={() => {
                                            return (
                                                <View style={{ height: 10 }} />
                                            )
                                        }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => props?.AddToCart(item)}
                                                    style={{
                                                        paddingTop: hp('1%'),
                                                        borderRadius: 10,
                                                        backgroundColor: "white",
                                                        elevation: 5,
                                                        marginLeft: wp('1%'),
                                                        marginVertical: hp('2%'),
                                                        paddingHorizontal: wp('1%'),
                                                    }}>

                                                    <View style={{
                                                        marginVertical: hp('1%'),
                                                        marginTop: hp('1.5%'),
                                                        justifyContent: "center",
                                                        alignItems: "flex-start",
                                                    }}>
                                                        <View style={{
                                                            height: heightPercentageToDP('7%'),
                                                        }}>
                                                            <Text numberOfLines={2} style={{ color: "#515151", fontSize: hp('2.2%'), width: wp('10%'), textAlign: "left", fontWeight: "bold" }}>{item?.name_fr}</Text>
                                                        </View>
                                                        <Text style={{ color: "#28A745", fontSize: hp('2%'), width: wp('10%'), textAlign: "left", fontWeight: "bold" }}>{item?.price_euro} TND </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                    }
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <AntDesign style={{ elevation: 10, position: 'absolute', left: -wp('0.8%'), zIndex: 1, backgroundColor: "white", padding: 5, borderRadius: 50 }} onPress={upButtonHandler} name='left' color={'#6C757D'} size={hp('2.4%')} />
                <AntDesign style={{ elevation: 10, position: 'absolute', right: -wp('0.8%'), zIndex: 1, backgroundColor: "white", padding: 5, borderRadius: 50 }} onPress={downButtonHandler} name='right' color={'#6C757D'} size={hp('2.4%')} />
                {props?.Product?.categoryLoader ? (
                    <CategoryPlaceholder />
                ) :
                    <FlatList
                        data={props?.Product?.category}
                        horizontal
                        ref={(ref) => {
                            listViewRef = ref;
                        }}
                        keyExtractor={(item, index) => index}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                                    <ProductBelowButton
                                        index={index}
                                        title={item}
                                        onpress={() => { ButtonPressView(item), props?.changeCategoryAndGetProduct(item) }}
                                        value={buttonState == item ? true : false}
                                    />
                                </View>
                            )
                        }}
                    />
                }
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <OrderCustomButtom
                    title='Sales'
                    color='#6C757D'
                    valueHighlight={highlightTextColorValue == 'Sales' ? true : false}
                    onpressout={() => setHighlightTextColorValue('')}
                    onpressin={() => setHighlightTextColorValue('Sales')}
                    onpress={() => OrderButton('Sales')}
                    loader={false}
                />
                <View style={{ flexDirection: "row", justifyContent: 'flex-end', alignItems: "center" }}>
                    <OrderCustomButtom
                        title='Cancel Order'
                        color='#CD948F'
                        valueHighlight={highlightTextColorValue == 'Cancel Order' ? true : false}
                        onpressout={() => setHighlightTextColorValue('')}
                        onpressin={() => setHighlightTextColorValue('Cancel Order')}
                        onpress={() => OrderButton('Cancel Order')}
                        loader={false}
                    />
                    <OrderCustomButtom
                        title='Hold Order'
                        color='#28A745'
                        valueHighlight={highlightTextColorValue == 'Hold Order' ? true : false}
                        onpressout={() => setHighlightTextColorValue('')}
                        onpressin={() => setHighlightTextColorValue('Hold Order')}
                        onpress={() => OrderButton('Hold Order')}
                        loader={props?.shared?.loader}
                    />
                </View>
            </View>

            <Sale
                modalVisible={modalVisible}
                mainOnPress={() => { setModalVisible(false) }}
                onPresssetModalVisible={() => setModalVisible(true)}
            />
            <Draft
                modalVisible={draftModal}
                mainOnPress={() => setDraftModal(!draftModal)}
            />
        </View>
    )
}

const mapStateToProps = ({ Product, shared }) => ({
    Product,
    shared
})

export default connect(mapStateToProps, {
    AddToCart,
    removeAllItemsToCart,
    getMoreData,
    ViewSaleInvoice,
    GetSaleProducts,
    DraftFtn,
    changeCategoryAndGetProduct,
    GetAlltheProductToExcel
})(ProductList)

const styles = StyleSheet.create({
    MainView: {
        flex: 1,
        marginVertical: hp('4%'),
        marginLeft: wp('2%')
    }
})