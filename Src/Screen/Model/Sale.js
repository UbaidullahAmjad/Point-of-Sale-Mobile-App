import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { connect } from 'react-redux';
import { getMoreData, ViewSaleInvoice } from '../../Store/Actions/PRoductAction';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ReturnSalesItems } from '../../Store/Actions/CartAction'

function Sale({ modalVisible, mainOnPress, onPresssetModalVisible, getMoreData, Product, ViewSaleInvoice, ReturnSalesItems }) {
    const [InvoiceSaleItemsData, setInvoiceSaleItemsData] = React.useState([])
    const [invoiceData, setInvoiceData] = React.useState('')
    const [filterData, setFilterData] = React.useState([])
    const [searchInputText, setSearchInputText] = React.useState('')
    const [indexValue, setIndexValue] = React.useState(-1)
    const [showDetail, setShowDetail] = useState(false)
    const [returnItems, setReturnItems] = useState(false)
    const [loaderReturnButton, setLoaderReturnButton] = useState(false)
    const [grandTotal, setGrandTotal] = useState('')

    const reachend = () => {
        getMoreData()
    }

    useEffect(() => {
        var amount = 0
        for (let index = 0; index < InvoiceSaleItemsData.length; index++) {
            amount = (InvoiceSaleItemsData[index].quantity * InvoiceSaleItemsData[index].unit_price) + amount;
        }
        console.log('Amount Total: ', amount.toFixed(2))
        setGrandTotal(amount.toFixed(2))
    }, [InvoiceSaleItemsData])

    const deleteReturnSlae = (item) => {
        let dataRturn = InvoiceSaleItemsData.filter(obj => obj.id != item.id)
        setInvoiceSaleItemsData(dataRturn)
    }

    const chnaangeQuanity = (item) => {
        var copy = [...InvoiceSaleItemsData]
        let index = copy.findIndex(obj => obj.id == item.id)
        if (index != -1) {
            if (copy[index].quantity > 1) {
                copy[index].quantity = copy[index].quantity - 1
                setInvoiceSaleItemsData(copy)
            }
            // else {
            //     let dataRt = copy.filter(obj => obj.id != item.id)
            //     setInvoiceSaleItemsData(dataRt)
            // }
        }
    }

    const ReturnOrder = async () => {
        setLoaderReturnButton(true)
        var dataFetch = await ReturnSalesItems(InvoiceSaleItemsData, invoiceData?.id)
        if (dataFetch == true) {
            setShowDetail(false)
            setReturnItems(false)
            setLoaderReturnButton(false)
        }
        else {
            setLoaderReturnButton(false)
        }
    }

    return (
        <Modal
            visible={modalVisible}
            transparent={true}
        >
            <TouchableOpacity
                onPressOut={mainOnPress}
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={onPresssetModalVisible}
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        width: wp('65%'),
                        height: hp('80%'),
                    }}>
                    {
                        showDetail ?
                            <>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View>
                                        <View>
                                            <AntDesign onPress={() => {
                                                setShowDetail(false)
                                                setReturnItems(false)
                                            }}
                                                name='left' color={'black'} size={30} style={{ zIndex: 1, position: "absolute", left: 20, top: 20 }} />
                                            <Text style={{ marginVertical: 20, fontSize: hp('4%'), color: 'black', fontWeight: "bold", textAlign: "center" }}>
                                                Order Summary
                                            </Text>
                                        </View>

                                        <View style={{ margin: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <View>
                                                <Text style={{ marginVertical: 10, fontSize: hp('2%'), color: 'black' }}>Order no: {invoiceData?.order_no}</Text>
                                                <Text style={{ fontSize: hp('2%'), color: 'black' }}>Date: {moment(invoiceData?.created_at).format('DD/MM/YYYY')}</Text>
                                                <Text style={{ marginVertical: 10, fontSize: hp('2%'), color: 'black' }}>Customer: {'Walk-In-Customer'}</Text>
                                            </View>

                                            {
                                                returnItems
                                                    ?
                                                    <TouchableOpacity onPress={() => ReturnOrder()} activeOpacity={0.8} style={{ borderRadius: 5, backgroundColor: "red", padding: wp('1%') }}>
                                                        {
                                                            loaderReturnButton
                                                                ? <ActivityIndicator size={'small'} color='white' />
                                                                : <Text style={{ color: "white", fontSize: hp('2%'), fontWeight: "bold" }}>Edit Order</Text>
                                                        }
                                                    </TouchableOpacity>
                                                    : <TouchableOpacity onPress={() => setReturnItems(!returnItems)} activeOpacity={0.8} style={{ borderRadius: 5, backgroundColor: "red", padding: wp('1%') }}>
                                                        <Text style={{ color: "white", fontSize: hp('2%'), fontWeight: "bold" }}>Return Items</Text>
                                                    </TouchableOpacity>
                                            }

                                        </View>

                                        <View style={{ paddingHorizontal: 10, paddingVertical: 20, borderBottomColor: 'silver', borderBottomWidth: 0.5, }}>
                                            <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Products</Text>
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                                <Text style={{ fontSize: hp('2%'), color: "black", fontWeight: "bold" }}>{'Product_Name (Quanity x Unit_Price)'}</Text>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: hp('2%'), color: "black", fontWeight: "bold" }}>{'Total'}</Text>
                                                    {returnItems ? <View style={{ marginHorizontal: wp('2%') }} /> : null}
                                                </View>
                                            </View>

                                            {InvoiceSaleItemsData.map((item, index) => {
                                                return (
                                                    <View key={index} style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                            <Text style={{ fontSize: hp('2%'), color: "black" }}>{item?.product_name + ` (${item?.quantity} x ${item?.unit_price})`}</Text>
                                                            {returnItems ? <AntDesign onPress={() => { chnaangeQuanity(item) }} name='minus' size={10} color='red' style={{ paddingLeft: wp('0.2%'), paddingTop: hp('0.3%'), paddingRight: wp('0.1%'), borderColor: 'red', borderRadius: 50, marginLeft: wp('1%'), borderWidth: 1, }} /> : null}
                                                        </View>
                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                            <Text style={{ fontSize: hp('2%'), color: "black" }}>{item?.unit_price * item?.quantity} TND</Text>
                                                            {returnItems ? <AntDesign onPress={() => { deleteReturnSlae(item) }} name='delete' size={14} color='red' style={{ marginHorizontal: wp('1%') }} /> : null}
                                                        </View>
                                                    </View>
                                                )
                                            })}

                                        </View>

                                        <View style={{ marginVertical: 10 }}>
                                            <View style={{ paddingHorizontal: 10, paddingVertical: 20, borderBottomColor: 'silver', borderBottomWidth: 0.5, flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                                <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Grand Total</Text>
                                                <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>{grandTotal == '' ? invoiceData?.grand_total : grandTotal} TND</Text>
                                            </View>

                                            <View style={{ paddingHorizontal: 10, paddingVertical: 20, marginTop: 20, backgroundColor: "#DDDDDD", flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                                <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Paid by: Cash</Text>
                                                <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Customer Paid: {invoiceData?.customer_pay} TND</Text>
                                                <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Change: {grandTotal == '' ? (invoiceData?.return).toFixed(2) : invoiceData?.customer_pay - grandTotal} TND</Text>
                                            </View>

                                            <Text style={{ marginVertical: 20, fontSize: hp('2%'), color: 'black', textAlign: "center" }}>
                                                Thank You For Shopping With Us. Please Come Again!
                                            </Text>
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={{
                                    justifyContent: "center",
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: "#6449E7",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingVertical: hp('2%')
                                        }}>
                                        <Text style={{ fontSize: hp('3.5%'), fontWeight: "bold", color: "white" }}>Print</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: hp('3%'), marginHorizontal: wp('2%') }}>
                                    <View style={{ flexDirection: "row", }}>
                                        <Text style={{ color: '#5E5873', fontSize: hp('3.5%'), fontWeight: "bold", }}>Sales</Text>
                                        <Text
                                            style={{
                                                color: '#5E5873',
                                                fontSize: hp('1.5%'),
                                                fontWeight: "bold",
                                                backgroundColor: '#F36292',
                                                padding: 5,
                                                height: hp('3%'),
                                                borderRadius: 5,
                                                color: "white",
                                                marginLeft: 5,
                                            }}>
                                            Latest
                                        </Text>
                                    </View>
                                    <TextInput
                                        keyboardType='phone-pad'
                                        value={searchInputText}
                                        placeholder='Search Order here ...'
                                        placeholderTextColor={'silver'}
                                        style={{
                                            backgroundColor: "#f0f0f0",
                                            paddingVertical: hp('1.5%'),
                                            width: wp('20%'),
                                            height: hp('6%'),
                                            fontSize: hp('1.8%'),
                                            color: 'black',
                                            padding: '2%',
                                            borderRadius: 50
                                        }}
                                        onChangeText={(text) => {
                                            if (text == '') {
                                                setFilterData([])
                                                setSearchInputText('')
                                            } else {
                                                let filteredData = Product?.sale_Products.filter((item) => {
                                                    return item.order_no.includes(text);
                                                });
                                                setFilterData(filteredData)
                                                setSearchInputText(text)
                                            }
                                        }}
                                    />
                                </View>

                                <View style={{ borderColor: 'silver', borderWidth: 0.5 }} />

                                <FlatList
                                    data={filterData.length != 0 ? filterData : Product?.sale_Products}
                                    keyExtractor={(item, index) => index}
                                    onEndReached={() => reachend()}
                                    onEndReachedThreshold={0.2}
                                    scrollEventThrottle={150}
                                    contentContainerStyle={{ paddingVertical: 10, }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ color: "black" }}>No Sales Product Found!</Text>
                                            </View>
                                        )
                                    }}
                                    ListFooterComponent={() => {
                                        return (
                                            <View style={{ height: 80, alignItems: 'center', justifyContent: "center" }} >
                                                {
                                                    Product?.nextPage ? (
                                                        <ActivityIndicator size="large" color="#ec607f" />
                                                    ) :
                                                        null
                                                }
                                            </View>
                                        )
                                    }}
                                    ListHeaderComponent={() => {
                                        return (
                                            <View style={{
                                                backgroundColor: '#F3F2F7',
                                                elevation: 3,
                                                borderRadius: 5,
                                                marginHorizontal: 12,
                                            }}>
                                                <DataTable>
                                                    <DataTable.Header>
                                                        <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Order Id</DataTable.Title>
                                                        <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Order Number</DataTable.Title>
                                                        <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Order Created at</DataTable.Title>
                                                        <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Grand Total (TND)</DataTable.Title>
                                                        <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Paid By</DataTable.Title>
                                                        <DataTable.Title style={{ justifyContent: "center", alignItems: "center" }}>Action</DataTable.Title>
                                                    </DataTable.Header>
                                                </DataTable>
                                            </View>
                                        )
                                    }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View key={index} style={{
                                                marginHorizontal: 12,
                                            }}>
                                                <DataTable>
                                                    <DataTable.Row>
                                                        <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{item?.id}</DataTable.Cell>
                                                        <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{item?.order_no}</DataTable.Cell>
                                                        <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{moment(item?.created_at).format('DD-MM-YYYY')}</DataTable.Cell>
                                                        <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{item?.grand_total} TND</DataTable.Cell>
                                                        <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>{'Cash'}</DataTable.Cell>
                                                        <DataTable.Cell style={{ justifyContent: "center", alignItems: "center" }}>
                                                            {
                                                                indexValue == index ?
                                                                    <ActivityIndicator
                                                                        size={'small'}
                                                                        color='black' />
                                                                    :
                                                                    <AntDesign
                                                                        onPress={async () => {
                                                                            setIndexValue(index)
                                                                            let result = await ViewSaleInvoice(item?.id)
                                                                            if (result) {
                                                                                setInvoiceData(result?.sale)
                                                                                setInvoiceSaleItemsData(result?.sale_items)
                                                                                setIndexValue(-1)
                                                                                setShowDetail(true)
                                                                            }
                                                                            else {
                                                                                setIndexValue(-1)
                                                                                console.log('error')
                                                                            }
                                                                        }} name='eye' color={'silver'} size={20}
                                                                    />
                                                            }
                                                        </DataTable.Cell>
                                                    </DataTable.Row>
                                                </DataTable>
                                            </View>
                                        )
                                    }}
                                />
                            </>
                    }
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const mapStateToProps = ({ Product }) => ({
    Product
})

export default connect(mapStateToProps, {
    getMoreData,
    ViewSaleInvoice,
    ReturnSalesItems
})(Sale)