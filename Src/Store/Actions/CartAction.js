import {
    CHANGE_CART,
    INVOICE_DATA,
    INVOICE_ITEMS,
    PRINT_SLIP_MODAL
} from './type'
import store from ".."
import { apiInstance } from '../../Confiq/AxiosInstance'
import { ToastAndroid, PermissionsAndroid } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import * as RNFS from 'react-native-fs';
import XLSX from "xlsx";
import Toast from 'react-native-toast-message';

export const AddToCart = (item) => {
    return async dispatch => {
        let AlreadyCart = [...store.getState().Cart.cart]
        if (AlreadyCart.length == 0) {
            let tempItem = { ...item }
            tempItem.quantity = 1
            dispatch({ type: CHANGE_CART, payload: [tempItem] })
        }
        else {
            const availableIndex = AlreadyCart.findIndex(obj => obj?.id == item.id)
            if (availableIndex == -1) {
                item.quantity = 1
                AlreadyCart.push(item)
                dispatch({ type: CHANGE_CART, payload: AlreadyCart })
            } else {
                AlreadyCart[availableIndex].quantity = AlreadyCart[availableIndex].quantity + 1
                dispatch({ type: CHANGE_CART, payload: AlreadyCart })
            }
        }
    }
}

export const QuantityChanged = (id, purpose) => {
    return async dispatch => {
        let AlreadyCart = [...store.getState().Cart.cart]
        const availableIndex = AlreadyCart.findIndex(obj => obj?.id == id)
        if (availableIndex != -1) {
            if (purpose == 'plus') {
                AlreadyCart[availableIndex].quantity = AlreadyCart[availableIndex].quantity + 1
                dispatch({ type: CHANGE_CART, payload: AlreadyCart })
            } else {
                if (AlreadyCart[availableIndex].quantity - 1 != 0) {
                    AlreadyCart[availableIndex].quantity = AlreadyCart[availableIndex].quantity - 1
                    dispatch({ type: CHANGE_CART, payload: AlreadyCart })
                }
            }
        }
    }
}

export const DeleteItem = (id) => {
    return async dispatch => {
        let AlreadyCart = [...store.getState().Cart.cart]
        const availableIndex = AlreadyCart.findIndex(obj => obj?.id == id)
        if (availableIndex != -1) {
            let remaining = AlreadyCart.filter(obj => obj.id != id)
            dispatch({ type: CHANGE_CART, payload: remaining })
        }
    }
}

export const payAmount = (isConnected, cart_item, customer_pay, returnpay, hide,) => {
    return async dispatch => {
        if (isConnected) {
            let GetProduct = await apiInstance.post(`pos_placeorder`, {
                cart_items: cart_item,
                customer_pay: customer_pay,
                return: returnpay
            }).then(function (response) {
                return response
            }).catch(function (error) {
                return error.response
            })
            const { status, data } = GetProduct
            if (status == 200) {
                dispatch({ type: CHANGE_CART, payload: [] })
                hide()
                let items = {
                    sale: data.sale,
                    sale_items: cart_item
                }
                dispatch({ type: INVOICE_DATA, payload: data.sale })
                dispatch({ type: INVOICE_ITEMS, payload: cart_item })
                dispatch({ type: PRINT_SLIP_MODAL, payload: true })

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'SoSuccessfully!',
                    text2: "Order has not been Placed Successfully"

                });
            }
        }
        else {
            var wb = XLSX.utils.book_new();
            var path = RNFS.DownloadDirectoryPath + '/Sales.xlsx';
            await RNFS.readFile(path, 'ascii').then(res => {
                const read = XLSX.read(res, { type: 'binary' })
                let data = read.Sheets['Sales']
                let jsondata = XLSX.utils.sheet_to_json(data, { header: 2 })
                let combinedata = [...cart_item]
                for (let i = 0; i < cart_item.length; i++) {
                    combinedata[i]['customer_pay'] = customer_pay
                    combinedata[i]['return'] = returnpay
                    combinedata[i]['saleid'] = jsondata[jsondata.length - 1].saleid + 1
                }
                const combine = jsondata.concat(combinedata)
                let allProductsheet = XLSX.utils.json_to_sheet(combine)
                XLSX.utils.book_append_sheet(wb, allProductsheet, 'Sales')
                let wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                RNFS.writeFile(RNFS.DownloadDirectoryPath + '/Sales.xlsx', wbout, 'ascii').then((r) => {
                    dispatch({ type: CHANGE_CART, payload: [] })
                    hide()
                    dispatch({ type: INVOICE_DATA, payload: {} })
                    dispatch({ type: INVOICE_ITEMS, payload: cart_item })
                    dispatch({ type: PRINT_SLIP_MODAL, payload: true })
                }).catch((e) => {
                    console.log('Error', e);
                });
            }).catch(async (err) => {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                );
                // When the file is not created.
                if (granted) {
                    let combinedata = [...cart_item]
                    for (let i = 0; i < cart_item.length; i++) {
                        combinedata[i]['customer_pay'] = customer_pay
                        combinedata[i]['return'] = returnpay
                        combinedata[i]['saleid'] = 1
                    }
                    let allProductsheet = XLSX.utils.json_to_sheet(combinedata)
                    XLSX.utils.book_append_sheet(wb, allProductsheet, 'Sales')
                    const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                    RNFS.writeFile(RNFS.DownloadDirectoryPath + '/Sales.xlsx', wbout, 'ascii').then((r) => {
                        dispatch({ type: CHANGE_CART, payload: [] })
                        hide()
                        let data = {
                            sale: {},
                            sale_items: cart_item
                        }

                        dispatch({ type: INVOICE_DATA, payload: {} })
                        dispatch({ type: INVOICE_ITEMS, payload: cart_item })
                        dispatch({ type: PRINT_SLIP_MODAL, payload: true })
                    }).catch((e) => {
                        console.log('Error', e);
                    });
                } else {
                    alert('Something Went Wrong!')
                }
            });

        }

    }
}

export const removeAllItemsToCart = () => {
    return async dispatch => {
        dispatch({ type: CHANGE_CART, payload: [] })

        dispatch({ type: INVOICE_DATA, payload: {} })
        dispatch({ type: INVOICE_ITEMS, payload: [] })
    }
}

export const ChangeTheSLipPrintModal = () => {
    return async dispatch => {
        dispatch({ type: PRINT_SLIP_MODAL, payload: false })
    }
}

export const ReturnSalesItems = (item, id) => {
    return async dispatch => {
        let GetProduct = await apiInstance.post(`return_order?id=${id}`, {
            sale_items: item
        }).then(function (response) {
            return response
        }).catch(function (error) {
            return error.response
        })
        const { status, data } = GetProduct
        if (status == 200) {
            ToastAndroid.show("return_order success !", ToastAndroid.LONG);
            return true
        }
        else {
            ToastAndroid.show("return_order not success !", ToastAndroid.LONG);
            return false
        }
    }
}