import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import CheckOut from '../Screen/Model/CheckOut';
import { DeleteItem, QuantityChanged, ChangeTheSLipPrintModal } from '../Store/Actions/CartAction';
import Toast from 'react-native-toast-message';

function InvoiceDetail(props) {
    const [Total, setTotal] = useState(0)
    const [InvoiceTotal, setInvoiceTotal] = useState(0)
    const [pay, setpay] = useState(false)
    const [invoiceModel, setInvoiceModel] = useState(false)
    const [RegexValueFalse, setRegexValueFalse] = useState(false)
    const [invoiceData, setInvoiceData] = useState('')
    const [invoiceItems, setInvoiceItems] = useState([])
    const [customerPay, setcustomerPay] = useState(0)
    const [changed, setchanged] = useState(0)
    console.log("Invocie detailsssssssssssssssssssssssssssssssssssssssssssssssssss", props?.Cart?.prinstSlipModal)
    const mainOnPress = React.useMemo(() => {
        return () => {
            setpay(false), setcustomerPay(0), setchanged(0)
        }
    }, [])
    const onPressSetPay = React.useMemo(() => {
        return () => setpay(false)
    }, [])
    useEffect(() => {
        var total = 0
        if (props?.Cart?.cart.length == 0) {
            setTotal(0)
        }
        for (let i = 0; i < props?.Cart?.cart.length; i++) {
            total = total + props?.Cart?.cart[i].quantity * props?.Cart?.cart[i]?.price_euro

        }
        setTotal(parseFloat(total).toFixed(1).replace(/\.0+$/, ''))
        setInvoiceTotal(parseFloat(total).toFixed(1).replace(/\.0+$/, ''))
    }, [props?.Cart?.cart])

    return (
        <View style={styles.MainView}>
            <View style={{
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 10,
                height: '92%',
            }}>
                <Text style={{ fontSize: hp('2.5%'), color: '#515151', fontWeight: 'bold', textAlign: "center", paddingTop: hp('2%') }}>Checkout</Text>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: hp('2%'),
                    flex: 1
                }}>
                    <FlatList
                        data={props?.Cart?.cart}
                        ListHeaderComponent={
                            <View style={{ padding: wp('0.5%'), backgroundColor: "#F1F1F1", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ width: wp('12%') }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: hp('2.1%'), fontWeight: "bold" }}>Name</Text>
                                </View>

                                <View style={{ width: wp('5%') }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: hp('2.1%'), fontWeight: "bold", textAlign: "center" }}>QTY</Text>
                                </View>

                                <View style={{ width: wp('5%') }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: hp('2.1%'), textAlign: "center", fontWeight: "bold", textAlign: "center" }}>Price</Text>
                                </View>

                                <View style={{ width: wp('4%') }} />
                            </View>
                        }
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={{ padding: wp('0.5%'), flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ width: wp('12%'), marginLeft: wp('0.5%') }}>
                                        <Text style={{ color: 'black', width: wp('10%'), fontSize: hp('2%'), fontWeight: "bold" }}>{item.name_fr}</Text>
                                    </View>
                                    <View style={{ width: wp('5%') }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity
                                                onPress={() => props?.QuantityChanged(item?.id, 'minus')}
                                                style={{ borderColor: '#28A745', borderWidth: 2, borderRadius: 50 }}>
                                                <AntDesign name='minus' color='#28A745' size={hp('2.5%')} />
                                            </TouchableOpacity>
                                            <Text style={{ marginHorizontal: wp('0.8%'), color: 'black', fontSize: hp('2%'), fontWeight: "bold" }}>{item.quantity}</Text>
                                            <TouchableOpacity
                                                onPress={() => props?.QuantityChanged(item?.id, 'plus')}
                                                style={{ borderColor: '#28A745', borderWidth: 2, borderRadius: 50 }}>
                                                <AntDesign name='plus' color='#28A745' size={hp('2.5%')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: wp('6%') }}>
                                        <Text style={{ color: 'black', fontSize: hp('2%'), textAlign: "center", fontWeight: "bold" }}>{`${(item.price_euro * item.quantity).toFixed(2)}`}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => props?.DeleteItem(item?.id)}
                                        style={{ width: wp('4%') }} >
                                        <AntDesign style={{ padding: wp('0.6%'), }} name='delete' color='red' size={hp('2.5%')} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </View>

                <View style={{
                    height: hp('20%'),
                    backgroundColor: "#F8F8F8",
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: wp('1%'),
                    }}>
                        <Text style={{ fontSize: hp('2%'), fontWeight: "bold", color: "#B4B7B6" }}>Discount (%)</Text>
                        <Text style={{ fontSize: hp('2%'), fontWeight: "bold", color: '#B4B7B6' }}>0 TND</Text>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: wp('1%')
                    }}>
                        <Text style={{ fontSize: hp('2%'), fontWeight: "bold", color: "#B4B7B6" }}>Sub Total</Text>
                        <Text style={{ fontSize: hp('2%'), fontWeight: "bold", color: '#B4B7B6' }}>{Total} TND</Text>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: wp('1%'),
                    }}>
                        <Text style={{ fontSize: hp('2%'), fontWeight: "bold", color: "#B4B7B6" }}>Tax
                            {/* <Text style={{ textDecorationLine: 'underline', color: "#F36292" }}>0%</Text> */}
                        </Text>
                        <Text style={{ fontSize: hp('2%'), fontWeight: "bold", color: '#B4B7B6' }}>{0} TND</Text>
                    </View>
                </View>

                <View style={{
                    height: hp('7%'),
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: wp('1%'),
                }}>
                    <Text style={{ fontSize: hp('2.5%'), fontWeight: "bold", color: "#515151" }}>Total</Text>
                    <Text style={{ fontSize: hp('2.5%'), fontWeight: "bold", color: '#28A745' }}>{Total} TND</Text>
                </View>
            </View>

            <TouchableOpacity
                // disabled={props?.Cart?.cart.length == 0 ? true : false}
                onPress={() => {
                    if (props?.Cart?.cart.length == 0) {
                        Toast.show({
                            type: 'error',
                            text1: 'OOPS!',
                            text2: "Kindly add item to the cart"

                        });
                    }
                    else {
                        setpay(true)
                    }
                }}
                activeOpacity={0.8}
                style={{
                    width: "100%",
                    backgroundColor: "#28A745",
                    paddingVertical: wp('0.9%'),
                    marginVertical: wp('1%'),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10
                }}>
                <Text style={{ color: '#fff', fontWeight: "bold", fontSize: hp('2%') }}>{`Pay (${Total}) TND`}</Text>
            </TouchableOpacity>

            <CheckOut
                pay={pay}
                mainOnPress={mainOnPress}
                Total={Total}
                customerPay={customerPay}
                changed={changed}
                RegexValueFalse={RegexValueFalse}
                onPressSetPay={onPressSetPay}
            // setSuccessDetail={(sale, saleitem) => {
            // console.log("Fuckkkkkkkkkkkkkkkkkkkkkkk")
            // setInvoiceModel(true)
            // setInvoiceData(sale)
            // setInvoiceItems(saleitem)
            // }}
            />

            {/* Invoice Modal  */}
            <Modal
                visible={props?.Cart?.prinstSlipModal}
                transparent={true}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { props?.ChangeTheSLipPrintModal(), setpay(false) }}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        // onPress={() => { setInvoiceModel(true) }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            padding: 10,
                            width: wp('50%'),
                            height: hp('85%'),
                        }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            height: hp('11%'),
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { setpay(false), props?.ChangeTheSLipPrintModal() }}
                                style={{
                                    width: wp('20%'),
                                    backgroundColor: "#999999",
                                    margin: wp('1%'),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10
                                }}>
                                <Text style={{ fontSize: hp('3%'), color: "white" }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    width: wp('20%'),
                                    backgroundColor: "#6449E7",
                                    margin: wp('1%'),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10
                                }}>
                                <Text style={{ fontSize: hp('3%'), color: "white" }}>Print</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ borderColor: 'silver', marginVertical: 10, borderWidth: 0.5 }} />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View>
                                <Text style={{ marginVertical: 20, fontSize: hp('4%'), color: 'black', fontWeight: "bold", textAlign: "center" }}>
                                    Invoice Generated
                                </Text>

                                <View style={{ margin: 10 }}>
                                    <Text style={{ marginVertical: 10, fontSize: hp('2%'), color: 'black' }}>Order no: {props?.Cart?.invoiceData?.order_no}</Text>
                                    <Text style={{ fontSize: hp('2%'), color: 'black' }}>Date: {moment(props?.Cart?.invoiceData?.created_at).format('DD/MM/YYYY')}</Text>
                                    <Text style={{ marginVertical: 10, fontSize: hp('2%'), color: 'black' }}>Customer: {'Walk-In-Customer'}</Text>
                                </View>

                                <View style={{ marginVertical: 10 }}>

                                    <View style={{ paddingHorizontal: 10, paddingVertical: 20, borderBottomColor: 'silver', borderBottomWidth: 0.5, }}>
                                        <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Products</Text>
                                        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                            <Text style={{ fontSize: hp('2%'), color: "black", fontWeight: "bold" }}>{'Product_Name (Quanity x Unit_Price)'}</Text>
                                            <Text style={{ fontSize: hp('2%'), color: "black", fontWeight: "bold" }}>{'Total'}</Text>
                                        </View>

                                        {props?.Cart?.invoiceItems.map((item, index) => {
                                            return (
                                                <View key={index} style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                                    {/* <Text style={{ fontSize: hp('2%'), color: "black" }}>{item?.product_id}</Text> */}
                                                    <Text style={{ fontSize: hp('2%'), color: "black" }}>{item?.name_fr + ` (${item?.quantity} x ${item?.price_euro})`}</Text>
                                                    <Text style={{ fontSize: hp('2%'), color: "black" }}>{Math.floor(item?.price_euro * item?.quantity).toFixed(2)} TND</Text>
                                                </View>
                                            )
                                        })}
                                    </View>

                                    <View style={{ paddingHorizontal: 10, paddingVertical: 20, borderBottomColor: 'silver', borderBottomWidth: 0.5, flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                        <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Grand Total</Text>
                                        <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>{parseFloat(InvoiceTotal).toFixed(2)} TND</Text>
                                    </View>

                                    {/* <Text style={{ marginVertical: 20, fontSize: hp('2.5%'), color: 'black', textAlign: "center", fontWeight: "bold" }}>In Words: Euro Six</Text> */}

                                    <View style={{ paddingHorizontal: 10, paddingVertical: 20, marginTop: 20, backgroundColor: "#DDDDDD", flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                                        <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Paid by: Cash</Text>
                                        <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Customer Paid: {props?.Cart?.invoiceData != '' ? parseFloat(props?.Cart?.invoiceData?.customer_pay).toFixed(2) : ''} TND</Text>
                                        <Text style={{ fontSize: hp('2.5%'), color: 'black', fontWeight: "bold" }}>Change: {props?.Cart?.invoiceData != '' ? parseFloat(props?.Cart?.invoiceData?.return).toFixed(2) : ''} TND</Text>
                                    </View>

                                    <Text style={{ marginVertical: 20, fontSize: hp('2%'), color: 'black', textAlign: "center" }}>
                                        Thank You For Shopping With Us. Please Come Again!
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

        </View>
    )
}

const mapStateToProps = ({ Cart }) => ({
    Cart
})

export default connect(mapStateToProps, {
    QuantityChanged,
    DeleteItem,
    ChangeTheSLipPrintModal
})(InvoiceDetail)

const styles = StyleSheet.create({
    MainView: {
        flex: 1,
        borderRadius: 10,
        marginVertical: hp('4%'),
        marginHorizontal: wp('2%')
    }
})