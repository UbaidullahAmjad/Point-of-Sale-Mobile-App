import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { nameValidation } from '../../Confiq/Helper';
import { connect } from 'react-redux';
import { payAmount } from '../../Store/Actions/CartAction';
import { useNetInfo } from "@react-native-community/netinfo"
function CheckOut({ pay, mainOnPress, onPressSetPay, Total, Cart, payAmount }) {
    console.log("checkOut")
    const netInfo = useNetInfo();
    const [RegexValueFalse, setRegexValueFalse] = useState(false)
    const [customerPay, setcustomerPay] = useState(0)
    const [changed, setchanged] = useState(0)

    let btn = [
        {
            title: 0.1,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(0.1),
                        setchanged(0.1 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 0.1).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 0.1) - Total)
                }

            }
        },
        {
            title: 0.2,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(0.2),
                        setchanged(0.2 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 0.2).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 0.2) - Total)
                }
            }
        },
        {
            title: 0.5,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(0.5),
                        setchanged(0.5 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 0.5).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 0.5) - Total)
                }
            }
        },
        {
            title: 1,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(1),
                        setchanged(1 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 1).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 1) - Total)
                }

            }
        },
        {
            title: 2,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(2),
                        setchanged(2 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 2).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 2) - Total)
                }
            }
        },
        {
            title: 5,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(5),
                        setchanged(5 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 5).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 5) - Total)
                }
            }
        },
        {
            title: 10,
            onPress: () => {
                if (customerPay == null || customerPay == '') {
                    setRegexValueFalse(false),
                        setcustomerPay(10),
                        setchanged(10 - Total)
                } else {
                    setRegexValueFalse(false),
                        setcustomerPay((parseFloat(customerPay) + 10).toFixed(2).replace(/\.0+$/, '')),
                        setchanged((parseFloat(customerPay) + 10) - Total)
                }
            }
        },
        // {
        //     title: 'Clear',
        //     onPress: () => { setRegexValueFalse(false), setcustomerPay(0), setchanged(0) }
        // },
    ]

    const restthepay = React.useMemo(() => {
        return () => { setcustomerPay(0), setchanged(0) }
    }, [])

    const payftn = async () => {
        if (changed < 0) {
            Toast.show({
                type: 'error',
                text1: 'OOPS!',
                text2: "Changed amount can not be bigger than the Received amount"

            });
        }
        else if (customerPay == 0) {
            Toast.show({
                type: 'error',
                text1: 'OOPS!',
                text2: "Please pay some amount first!"

            });

        }
        else if (RegexValueFalse == true) {
            Toast.show({
                type: 'error',
                text1: 'OOPS!',
                text2: "Please Enter Valid Paying Amount!"

            });
        }
        else {
            payAmount(netInfo.isConnected, Cart?.cart, customerPay, changed, onPressSetPay, restthepay)
            setcustomerPay(0)
            setchanged(0)
        }

    }



    return (
        <Modal
            visible={pay}
            transparent={true}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressOut={mainOnPress}
                onPress={() => { setcustomerPay(0), setchanged(0) }}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={onPressSetPay}
                    onPress={() => { setcustomerPay(0), setchanged(0) }}
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        padding: 10,
                        width: wp('65%'),
                        height: hp('85%'),
                        flexDirection: "row"
                    }}>
                    <View style={{
                        width: "70%",
                        height: '100%',
                        padding: 15,
                    }}>
                        <View style={{ flex: 1 }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                marginRight: '3%'
                            }}>
                                <Text style={{
                                    fontSize: hp('4%'),
                                    color: "#000",

                                    fontWeight: 'bold'
                                }}>Total Amount (TND)*</Text>
                                <Text style={{
                                    fontSize: hp('4%'),
                                    color: "#000",

                                    fontWeight: 'bold'
                                }}>
                                    {parseFloat(Total).toFixed(2).replace(/\.0+$/, '').toString()}
                                </Text>

                            </View>

                            <View style={{
                                height: hp('20%'),
                                justifyContent: "center"
                            }}>
                                <Text style={{
                                    fontSize: hp('2%'),
                                    color: "#000",
                                    fontWeight: "bold",

                                    marginBottom: hp('1%'),
                                    marginLeft: wp('0.5%')
                                }}>Received Amount (TND)*</Text>
                                <TextInput
                                    // value={customerPay == '' ? '' :parseFloat(customerPay).toFixed(2).replace(/\.0+$/, '').toString()}
                                    value={customerPay == '' ? '' : customerPay.toString()}
                                    placeholder='0.00'
                                    keyboardType='numeric'
                                    onChangeText={(txt) => {
                                        let value = nameValidation(txt)

                                        if (value == true) {

                                            if (txt[txt.toString().length - 1] == '.') {
                                                setcustomerPay(txt)
                                                setRegexValueFalse(false)
                                            } else {
                                                let split = txt.split('.')
                                                if (split[1]?.length == 1 || split[1]?.length == 2) {
                                                    setcustomerPay(txt)
                                                    setchanged(txt - Total)
                                                } else {
                                                    setRegexValueFalse(false)
                                                    var numkber = parseFloat(txt).toFixed(2).replace(/\.00+$/, '')
                                                    setcustomerPay(numkber)
                                                    setchanged(txt - Total)
                                                }
                                            }
                                        }
                                        else {
                                            setRegexValueFalse(true)
                                            setcustomerPay('')
                                            setchanged(0)
                                        }
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: RegexValueFalse ? 'red' : 'silver',
                                        borderRadius: wp('0.8%'),
                                        paddingLeft: 8,
                                        fontSize: hp('3%'),
                                        height: hp('8%'),
                                        width: "100%"
                                    }}
                                />
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                marginRight: '3%',

                            }}>
                                <Text style={{
                                    fontSize: hp('4%'),
                                    color: "#000",
                                    marginBottom: 8,
                                    fontWeight: 'bold'
                                }}>Change (TND)*</Text>
                                <Text style={{
                                    fontSize: hp('4%'),
                                    color: "#000",
                                    marginBottom: 8,
                                    fontWeight: 'bold'
                                }}>{parseFloat(changed.toString()).toFixed(2).replace(/\.0+$/, '')}</Text>

                            </View>
                        </View>

                        <TouchableOpacity
                            disabled={RegexValueFalse}
                            onPress={() => payftn()}
                            style={{
                                paddingVertical: 12,
                                borderRadius: 12,
                                paddingVertical: hp('2%'),
                                backgroundColor: "#28A745",
                                marginTop: 12
                            }}>
                            <Text style={{ color: "#fff", fontSize: hp('3%'), textAlign: "center" }}>Submit</Text>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "space-between"
                        }}>
                            <TouchableOpacity
                                onPress={() => { setRegexValueFalse(false), setcustomerPay(0), setchanged(0) }}
                                style={{
                                    paddingVertical: 12,
                                    borderRadius: 12,
                                    paddingVertical: hp('2%'),
                                    backgroundColor: "#FFC107",
                                    marginTop: hp('2%'),
                                    width: '49%'
                                }}>
                                <Text style={{ color: "#fff", fontSize: hp('3%'), textAlign: "center" }}>Clear</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onPressSetPay}
                                onPressOut={() => { setcustomerPay(0), setchanged(0) }}
                                style={{
                                    paddingVertical: 12,
                                    borderRadius: 12,
                                    paddingVertical: hp('2%'),
                                    backgroundColor: "#DC3545",
                                    marginTop: hp('2%'),
                                    width: '49%'
                                }}>
                                <Text style={{ color: "#fff", fontSize: hp('3%'), textAlign: "center" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        width: "30%",
                        height: "100%",
                        justifyContent: "center"
                    }}>
                        <FlatList
                            data={btn}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        // disabled={item?.title != 'Clear' &&RegexValueFalse}
                                        key={index}
                                        onPress={item?.onPress}
                                        style={{
                                            paddingVertical: hp('2.9%'),
                                            borderRadius: 12,
                                            backgroundColor: "#17A2B8",
                                            marginTop: hp('2%'),
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: hp('2.8%'), textAlign: "center" }}>{item?.title}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
            <Toast />
        </Modal>
    )
}

const mapStateToProps = ({ Cart }) => ({
    Cart
})

export default connect(mapStateToProps, {
    payAmount
})(CheckOut)