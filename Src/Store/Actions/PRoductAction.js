
import { PermissionsAndroid } from 'react-native';
import * as RNFS from 'react-native-fs';
import XLSX from "xlsx";
import store from "..";
import { apiInstance } from "../../Confiq/AxiosInstance";
import {
    CHANGE_CART, CHANGE_CATEGORY, CHANGE_DRAFT, CHANGE_EXCEL_FILE,
    CHANGE_INTERNET_LOADER, CHANGE_LOADER, CHANGE_NEXT_PAGE,
    CHANGE_PAGE_NUMBER, CHANGE_PRODUCT, CHANGE_SALES_PRODUCTS, DATA_SUCCESSFULLY_GET
} from './type';
import { openDatabase } from 'react-native-sqlite-storage';
import { DeleteDraftOffline, returnFormatedDraftData } from '../../Confiq/Helper';

export const GetSaleProducts = () => {
    return async dispatch => {
        // First get the Sales
        dispatch({ type: CHANGE_NEXT_PAGE, payload: true })
        dispatch({ type: CHANGE_PAGE_NUMBER, payload: 1 })
        let getSalesProduct = await apiInstance.get(`get_sales/${store.getState().Product.pageNumber}`, {
        }).then(function (response) {
            return response
        }).catch(function (error) {
            return error.response
        })
        const { status, data } = getSalesProduct
        if (status == 200) {
            dispatch({ type: CHANGE_SALES_PRODUCTS, payload: data?.sales })
        }
    }
}

export const getMoreData = (id) => {
    return async dispatch => {
        if (store.getState().Product.nextPage) {
            dispatch({ type: CHANGE_PAGE_NUMBER, payload: store.getState().Product.pageNumber + 1 })
            let getSalesProduct = await apiInstance.get(`get_sales/${store.getState().Product.pageNumber}`, {
            }).then(function (response) {
                return response
            }).catch(function (error) {
                return error.response
            })
            const { status, data } = getSalesProduct

            if (status == 200) {
                if (data?.sales.length <= 0) {
                    dispatch({ type: CHANGE_NEXT_PAGE, payload: false })
                }
                else {
                    let Product = [...store?.getState()?.Product?.sale_Products]
                    let combine = Product.concat(data?.sales)
                    dispatch({ type: CHANGE_SALES_PRODUCTS, payload: combine })
                    dispatch({ type: CHANGE_NEXT_PAGE, payload: true })
                }
            }
        }
        else {
            return null
        }
    }
}

export const ViewSaleInvoice = (Id) => {
    return async dispatch => {
        // First get the Sales
        let ViewSaleInvoice = await apiInstance.get(`view_sale/${Id}`, {
        }).then(function (response) {
            return response
        }).catch(function (error) {
            return error.response
        })
        const { status, data } = ViewSaleInvoice
        if (status == 200) {
            return data
        }
        else {
            return false
        }
    }
}

export const DraftFtn = (isConnected) => {
    return async dispatch => {
        if (isConnected) {
            console.log("###", store.getState().Cart.cart)
            dispatch({ type: CHANGE_LOADER, payload: true })
            let draftReady = await apiInstance.post(`make_draft_order`, {
                cart_items: store.getState().Cart.cart,
            }).then(function (response) {
                return response
            }).catch(function (error) {
                return error.response
            })
            const { status, data } = draftReady
            dispatch({ type: CHANGE_LOADER, payload: false })
            if (status == 200) {
                let draftBook = XLSX.utils.book_new();
                let allDrafts = []

                for (let i = 0; i < data?.drafts.length; i++) {
                    for (let j = 0; j < data?.drafts[i]?.draft_items.length; j++) {
                        let data1 = { ...data?.drafts[i]?.draft_items[j] }
                        data1['item_count'] = data?.drafts[i].draft?.item_count
                        data1['grand_total'] = data?.drafts[i].draft?.grand_total
                        allDrafts.push(data1)
                    }
                }
                let draftsData = XLSX.utils.json_to_sheet(allDrafts)
                let offlineData = XLSX.utils.json_to_sheet([])
                XLSX.utils.book_append_sheet(draftBook, draftsData, 'All_Sheet')
                XLSX.utils.book_append_sheet(draftBook, offlineData, 'OfflineDraft')
                const wbout = XLSX.write(draftBook, { type: 'binary', bookType: "xlsx" });
                RNFS.writeFile(RNFS.DownloadDirectoryPath + '/Drafts.xlsx', wbout, 'ascii').then((r) => {
                    dispatch({ type: CHANGE_DRAFT, payload: data?.drafts })
                    dispatch({ type: CHANGE_CART, payload: [] })

                }).catch((e) => {
                    console.log('Get Draft data issue from database ::::::> ', e);
                });
            }
        } else {
            let pathDraft = RNFS.DownloadDirectoryPath + '/Drafts.xlsx';
            await RNFS.readFile(pathDraft, 'ascii').then(res => {
                var item_count = 0
                var grand_total = 0
                for (let i = 0; i < store.getState().Cart.cart.length; i++) {
                    item_count = store.getState().Cart.cart[i].quantity + item_count
                    grand_total = (store.getState().Cart.cart[i].quantity * store.getState().Cart.cart[i].price_euro) + grand_total
                }

                let draftBook = XLSX.read(res, { type: 'binary' })
                let sheetdata = draftBook.Sheets['OfflineDraft']
                const jsondata = XLSX.utils.sheet_to_json(sheetdata, { header: 2 })
                if (jsondata.length != 0) {
                    var id = jsondata[jsondata.length - 1].offlineDraftId + 1
                } else {
                    var id = 0
                }
                let ExcelDraftFormattedData = []
                for (let i = 0; i < store.getState().Cart.cart?.length; i++) {
                    const { name_fr, price_euro, image, description, isActive, created_at, quantity, quantity_added } = store.getState().Cart.cart[i]
                    let time = new Date()
                    let data = {
                        id: store.getState().Cart.cart[i].id,
                        name_fr: name_fr,
                        price_euro: price_euro,
                        image: image,
                        description: description,
                        isActive: isActive,
                        created_at: time.toISOString(),
                        quantity: quantity,
                        quantity_added: quantity_added,
                        item_count: item_count,
                        grand_total: grand_total,
                        offlineDraftId: id
                    }
                    ExcelDraftFormattedData.push(data)
                }

                XLSX.utils.sheet_add_json(
                    draftBook.Sheets.OfflineDraft, // worksheet
                    ExcelDraftFormattedData, // data
                    {
                        skipHeader: true,
                        origin: -1
                    }
                );
                const wbout = XLSX.write(draftBook, { type: 'binary', bookType: "xlsx" });
                RNFS.writeFile(RNFS.DownloadDirectoryPath + '/Drafts.xlsx', wbout, 'ascii').then((res) => {
                    let wb = XLSX.read(wbout, { type: 'binary' })
                    let AllDraft = wb.Sheets[wb.SheetNames[0]]
                    let MissingDraft = wb.Sheets[wb.SheetNames[1]]
                    const AlldreftData = XLSX.utils.sheet_to_json(AllDraft, { header: 2 })
                    const MissingDraftData = XLSX.utils.sheet_to_json(MissingDraft, { header: 2 })
                    let online = returnFormatedDraftData(AlldreftData, 'draft_id')
                    let offline = returnFormatedDraftData(MissingDraftData, 'offlineDraftId')
                    let combine = offline.reverse().concat(online)
                    // Read correctly when added  
                    // const draft = [{
                    //     draft: {
                    //         item_count: item_count,
                    //         grand_total: grand_total
                    //     },
                    //     draft_items: store.getState().Cart.cart
                    // }]
                    // const combile = draft.concat(store.getState().Cart?.draft)
                    dispatch({ type: CHANGE_CART, payload: [] })
                    dispatch({ type: CHANGE_DRAFT, payload: combine })

                }).catch((e) => {
                    console.log('Get Draft data issue from databaseeeee ::::::> ', e);
                });
            })


        }

    }

}

export const DeleteDraft = (id, edit, offline, isConnected, mainOnPress) => {
    return async dispatch => {
        // dispatch({ type: CHANGE_LOADER, payload: true })
        if (offline) {
            DeleteDraftOffline(id, dispatch)
        } else {
            if (isConnected) {
                let draftReady = await apiInstance.post(`remove_draft?id=${id}`, {
                    cart_items: store.getState().Cart.cart,
                }).then(function (response) {
                    return response
                }).catch(function (error) {
                    return error.response
                })
                const { status, data } = draftReady
                if (status == 200) {
                    // DeleteDraftOffline(id, dispatch , true)

                }
            }

        }
    }

}



//  New flow some of the  the above fucntion must be deleted when offline system completed
var db = openDatabase(
    { name: 'POS.db', location: 'default' },
    () => console.log("SUusscessfullffffffffffffffffffffffffppppppppppppppppppppppppppppppppppppppppppppppppppppp"),
    (e) => console.log("Error ", e)
);

const data = [
    {
        "category": {
            "id": 5,
            "name_fr": "ROYAL BOMBS",
            "image": "16421570346278.png",
            "isActive": "1",
            "created_at": "2021-11-08T04:09:25.000000Z",
            "updated_at": "2022-01-14T10:43:54.000000Z"
        },
        "products": [
            {
                "id": 36,
                "name_fr": "Bouncy Bomb",
                "price_euro": 3.8,
                "image": "16421758461852.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:11:35.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 37,
                "name_fr": "Brownie Bomb",
                "price_euro": 3.8,
                "image": "16421759018515.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:12:39.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 38,
                "name_fr": "Buttercookie Bomb",
                "price_euro": 3.8,
                "image": "16421759466388.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>\r\n\r\n<h2>&nbsp;</h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:15:51.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 39,
                "name_fr": "Caramel Buiscuit Bomb",
                "price_euro": 3.8,
                "image": "16421759821570.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:16:58.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 40,
                "name_fr": "CatCit Bomb",
                "price_euro": 3.8,
                "image": "1642176033375.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>\r\n\r\n<h2><strong>Garniture:&nbsp;Nutella</strong></h2>\r\n\r\n<h2><strong>Gla&ccedil;age:&nbsp;Chocolat Au Lait</strong></h2>\r\n\r\n<h2><strong>Garniture:&nbsp;Kitkat, Copeaux De Chocolat</strong></h2>\r\n\r\n<h2><strong>Sauce:&nbsp;Chocolat&nbsp;Blanc</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:17:57.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 41,
                "name_fr": "Cereal Bomb",
                "price_euro": 3.8,
                "image": "164217608422.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>\r\n\r\n<p>&nbsp;</p>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:18:51.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 42,
                "name_fr": "Cocoflash Bomb",
                "price_euro": 3.8,
                "image": "16421761399759.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:19:51.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 43,
                "name_fr": "Kid-Choc Bomb",
                "price_euro": 3.8,
                "image": "16421765982228.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:20:40.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 44,
                "name_fr": "Milky-Hazel Bomb",
                "price_euro": 3.8,
                "image": "16421767293631.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:21:43.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 45,
                "name_fr": "Mint-Choc Bomb",
                "price_euro": 3.8,
                "image": "16421767653966.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>\r\n\r\n<h2><strong>Garniture:&nbsp;Cr&egrave;me&nbsp;De&nbsp;Nutella</strong></h2>\r\n\r\n<h2><strong>Gla&ccedil;age:&nbsp;Chocolat&nbsp;Noir</strong></h2>\r\n\r\n<h2><strong>Garniture:&nbsp;After Eight</strong></h2>\r\n\r\n<h2><strong>Sauce:&nbsp;Chocolat Noir</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:22:44.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 46,
                "name_fr": "MM`s Bomb",
                "price_euro": 3.8,
                "image": "16421768131895.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:23:33.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 47,
                "name_fr": "Oreo Bomb",
                "price_euro": 3.8,
                "image": "16421768476645.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:24:36.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 48,
                "name_fr": "Powder Bomb",
                "price_euro": 3.8,
                "image": "16421768978881.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>\r\n\r\n<h2><strong>Garniture:&nbsp;Nutella</strong></h2>\r\n\r\n<h2><strong>Gla&ccedil;age:&nbsp;Sans Gla&ccedil;age</strong></h2>\r\n\r\n<h2><strong>Garniture:&nbsp;Sucre En Poudre</strong></h2>\r\n\r\n<h2><strong>Sauce:&nbsp;Nutella</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:25:50.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 49,
                "name_fr": "Praliné Bomb",
                "price_euro": 3.8,
                "image": "16421769436654.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:26:39.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 50,
                "name_fr": "Tix Bomb",
                "price_euro": 3.8,
                "image": "1642177067418.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:27:57.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 51,
                "name_fr": "Toble Bomb",
                "price_euro": 3.8,
                "image": "16421771404357.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>",
                "isActive": "1",
                "category_id": 5,
                "created_at": "2022-01-10T11:28:40.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": null,
                "quantity": 0,
                "quantity_added": 0,
                "isBox": null,
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            }
        ]
    },
    {
        "category": {
            "id": 6,
            "name_fr": "COOL BOMBS",
            "image": "16421570464580.png",
            "isActive": "1",
            "created_at": "2021-11-08T04:09:45.000000Z",
            "updated_at": "2022-01-14T10:44:06.000000Z"
        },
        "products": [
            {
                "id": 21,
                "name_fr": "Caramel Cool Flash",
                "price_euro": 4.3,
                "image": "16421715406495.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>",
                "isActive": "1",
                "category_id": 6,
                "created_at": "2022-01-10T09:50:13.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": "1",
                "quantity": 629,
                "quantity_added": 2,
                "isBox": "1",
                "caisse_product_id": null,
                "prod_zelty_key": "775627",
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 22,
                "name_fr": "Cheese Cake",
                "price_euro": 4.2,
                "image": "16421716258983.webp",
                "description_fr": "<h2><strong>Base:&nbsp;Donut</strong></h2>\r\n\r\n<h2>&nbsp;</h2>",
                "isActive": "1",
                "category_id": 6,
                "created_at": "2022-01-10T09:52:32.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": "1",
                "quantity": 231,
                "quantity_added": 1,
                "isBox": "1",
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            },
            {
                "id": 23,
                "name_fr": "Freezy Choc-Cream",
                "price_euro": 4.2,
                "image": "16421716771149.webp",
                "description_fr": "<h2><strong>Base: Donut</strong></h2>\r\n\r\n<h2>&nbsp;</h2>",
                "isActive": "1",
                "category_id": 6,
                "created_at": "2022-01-10T09:53:22.000000Z",
                "updated_at": "2022-08-15T11:31:41.000000Z",
                "isSpecial": "1",
                "quantity": 75,
                "quantity_added": 0,
                "isBox": "0",
                "caisse_product_id": null,
                "prod_zelty_key": null,
                "pos_active": 1,
                "pos_featured": 0,
                "alert_quantity": 0,
                "featured_item": 0
            }
        ]
    },
]
export const GetAlltheProductToExcel = () => {
    return async dispatch => {
        try {
            db.transaction(function (tx) {
                tx.executeSql('DELETE  from Category')
                tx.executeSql('DELETE  from Product')
                productAndCategory()
            })
            // for (let i = 0; i < data.length; i++) {
            //     db.transaction(function (tx) {
            //         console.log("TTT")
            //         tx.executeSql(
            //             'INSERT into Category (server_id, name_fr , image , isActive) VALUES (? , ? , ? , ?)',
            //             [data[i].category.id, data[i].category.name_fr, data[i].category.image, data[i].category.isActive],
            //             (tx, results) => {
            //                 if (results.rowsAffected > 0) {
            //                     console.log('inseted')
            //                 } else alert('Registration Failed');
            //             },
            //             (e) => console.log("Error in Saving Category in Local database", e),
            //         );
            //     });
            //     for (let j = 0; j < data[i].products.length; j++) {
            //         db.transaction(function (tx) {
            //             tx.executeSql(
            //                 'INSERT INTO Product (catid, name_fr , server_productid , price_euro , image , description , isActive , quantity , quantity_added ) VALUES (?,?,?,?,?,?,?,?,?)',
            //                 [data[i].category.id, data[i].products[j].name_fr, data[i].products[j].id, data[i].products[j].price_euro, data[i].products[j].image, data[i].products[j].description, data[i].products[j].isActive, data[i].products[j].quantity, data[i].products[j].quantity_added],
            //                 (tx, results) => {
            //                     if (results.rowsAffected > 0) {
            //                         console.log('inseted')
            //                         // alert('ee')
            //                     } else alert('Registration Failed');
            //                 },
            //                 (e) => console.log("Error in Saving Category in Local database", e),
            //             );
            //         });
            //     }
            // }
        } catch (error) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$TRY ERROR", error)
        }
    }
}

function productAndCategory() {
    // Call API
    for (let i = 0; i < data.length; i++) {
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT into Category (server_id, name_fr , image , isActive) VALUES (? , ? , ? , ?)',
                [data[i].category.id, data[i].category.name_fr, data[i].category.image, data[i].category.isActive],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        console.log('inseted')
                    } else alert('Registration Failed');
                },
                (e) => console.log("Error in Saving Category in Local database", e),
            );
        });
        for (let j = 0; j < data[i].products.length; j++) {
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO Product (catid, name_fr , server_productid , price_euro , image , description , isActive , quantity , quantity_added ) VALUES (?,?,?,?,?,?,?,?,?)',
                    [data[i].category.id, data[i].products[j].name_fr, data[i].products[j].id, data[i].products[j].price_euro, data[i].products[j].image, data[i].products[j].description, data[i].products[j].isActive, data[i].products[j].quantity, data[i].products[j].quantity_added],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('inseted')
                            // alert('ee')
                        } else alert('Registration Failed');
                    },
                    (e) => console.log("Error in Saving Category in Local database", e),
                );
            });
        }
    }
    ReadProductCategory()
}

function ReadProductCategory() {
    db.transaction(function (tx) {
        var Category = []
        var allProduct = []
        tx.executeSql(
            'SELECT * FROM Category',

            (tx, results) => {
                for (let i = 0; i < results.rows.length; ++i) {

                    tx.executeSql(
                        `SELECT * FROM Product where catid = ${results.rows.item(i).server_id}`,
                        [],
                        (tx, results) => {

                        }
                    )
                    console.log(results.rows.item(i))
                    Category.push(results.rows.item(i));
                }
                console.log("*****************************************************************************************************")
                console.log(Category)
            },
            (e) => console.log("Problem In reading::::::::", e),
        );


    })

}



export const changeCategoryAndGetProduct = (item) => {
    return async dispatch => {
        let Product = store.getState()?.shared?.excelReferencce.Sheets[item]
        const jsondata = XLSX.utils.sheet_to_json(Product, { header: 2 })
        dispatch({ type: CHANGE_PRODUCT, payload: jsondata })

    }
}

export const AlreadyFilesExist = () => {
    return async dispatch => {
        db.transaction(function (tx) {
            tx.executeSql(
                'SELECT * FROM Category',
                (tx, results) => {
                    if (results.rows.length > 0) {
                            // Call a Function Read Product Category
                    }else{
                        // call SaveServerDataToLocal
                    }
                }

            )

        })
    }
}


export const SendDataWhenOnline = () => {
    return async dispatch => {
        // Send offline Sold item data to server when connected 
        var path = RNFS.DownloadDirectoryPath + '/Sales.xlsx';
        let soldItem = await getSoldItemFromExcel()
        if (soldItem.length != 0) {
            dispatch({ type: CHANGE_INTERNET_LOADER, payload: true })
            console.log('sold items')
            let soldItemstoServer = await apiInstance.post(`multiple_sales`, {
                data: soldItem
            }).then(function (response) {
                return response
            }).catch(function (error) {
                return error.response
            })
            const { status, data } = soldItemstoServer
            console.log(status)
            console.log("dataaa", data)
            dispatch({ type: CHANGE_INTERNET_LOADER, payload: false })
            if (status == 200) {
                await RNFS.unlink(path);
            }
        }
        //  send Draft item data to server when connected


    }
}


// Helper Function
async function getSoldItemFromExcel() {
    var path = RNFS.DownloadDirectoryPath + '/Sales.xlsx';
    var sales = []
    await RNFS.readFile(path, 'ascii').then(res => {
        const wb = XLSX.read(res, { type: 'binary' })
        let data = wb.Sheets['Sales']
        const jsondata = XLSX.utils.sheet_to_json(data, { header: 2 })
        let indexs = []
        for (let i = 0; i < jsondata.length; i++) {
            indexs.push(jsondata[i].saleid)
        }
        let salesids = [...new Set(indexs)];

        for (let i = 0; i < salesids.length; i++) {
            let cart_items = []
            for (let j = 0; j < jsondata.length; j++) {
                if (jsondata[j].saleid == salesids[i]) {
                    cart_items.push(jsondata[j])
                }

            }
            const obj = {
                cart_items: cart_items,
                customer_pay: cart_items[0]?.customer_pay,
                return: cart_items[0]?.return

            }
            sales.push(obj)
        }
        console.log("sales", sales[0].cart_items)

    })
        .catch(async (err) => {
            console.log("##################Sale data send to server", err)
        });
    return sales
}
// Get All the data of draft from database
async function CreateTheDraftFile(drafts, dispatch) {
    console.log("sss", drafts)
    var allDrafts = []
    for (let i = 0; i < drafts.length; i++) {
        for (let j = 0; j < drafts[i]?.draft_items.length; j++) {
            let data = { ...drafts[i]?.draft_items[j] }
            data['item_count'] = drafts[i]?.draft?.item_count
            data['grand_total'] = drafts[i]?.draft?.grand_total
            allDrafts.push(data)
        }
    }
    const Heading = [[
        'id',
        'name_fr',
        'price_euro',
        'image',
        'description',
        'isActive',
        'created_at',
        'quantity',
        'quantity_added',
        'item_count',
        'grand_total',
        'offlineDraftId'
    ]]
    var draftBook = XLSX.utils.book_new();
    let draftsData = XLSX.utils.json_to_sheet(allDrafts)
    // let OfflineDraft = XLSX.utils.json_to_sheet([])
    let OfflineDraft = XLSX.utils.sheet_add_aoa(draftBook, Heading, { origin: 'A1' });
    XLSX.utils.book_append_sheet(draftBook, draftsData, 'All_Sheet')
    XLSX.utils.book_append_sheet(draftBook, OfflineDraft, 'OfflineDraft')
    const wbout = XLSX.write(draftBook, { type: 'binary', bookType: "xlsx" });
    RNFS.writeFile(RNFS.DownloadDirectoryPath + '/Drafts.xlsx', wbout, 'ascii').then((r) => {
        dispatch({ type: CHANGE_DRAFT, payload: drafts })

    }).catch((e) => {
        console.log('Get Draft data issue from database22222 ::::::> ', e);

    });
}





// set Up Database




