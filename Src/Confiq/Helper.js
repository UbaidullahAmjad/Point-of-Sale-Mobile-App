import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import XLSX from "xlsx";
import {
    CHANGE_DRAFT
} from '../Store/Actions/type'
export function otherStatus(res) {
    if (res.status == 400) {
        Toast.show({
            type: 'error',
            text1: 'OOPS!',
            text2: "Something Went Wrong, Please try again later"

        });
    }
    else if (res.status == 401) {
        Toast.show({
            type: 'error',
            text1: 'Sorry!',
            text2: "Something Went Wrong, Please try again later"

        });
    }
    else if (res.status == 403) {
        Toast.show({
            type: 'error',
            text1: 'Sorry!',
            text2: "Something Went Wrong, Please try again later"

        });
    }
    else if (res.status == 404) {
        Toast.show({
            type: 'error',
            text1: 'Sorry!',
            text2: "Something Went Wrong, Please try again later"

        });
    }
}

export function rejection(error, dispatch) {
    if (error.message === 'Network Error') {
        Toast.show({
            type: 'error',
            text1: 'Internet!',
            text2: "Kindly Check Your Internet Connection"

        });
    }
}

export function nameValidation(name) {
    // if (/^[0-9\b]+$/.test(name)) {
    if (/^[0-9][\.\d]*(,\d+)?$/.test(name)) {
        return true
    }
    else {
        return false
    }
}


export async function DeleteDraftOffline(id, dispatch) {
    var path = RNFS.DownloadDirectoryPath + '/Drafts.xlsx';
    await RNFS.readFile(path, 'ascii').then(res => {
        const read = XLSX.read(res, { type: 'binary' })
        let data = read.Sheets['OfflineDraft']
        let onlineSheetdata = read.Sheets['All_Sheet']
        let jsondata = XLSX.utils.sheet_to_json(data, { header: 2 })
        const alldata = returnFormatedDraftData(jsondata, 'offlineDraftId')
        const remainingdata = alldata.filter(obj => obj.draft?.offlineDraftId != id)
        var savingData = []
        for (let i = 0; i < remainingdata.length; i++) {
            for (let j = 0; j < remainingdata[i].draft_items.length; j++) {
                let obj = { ...remainingdata[i].draft_items[j] }
                obj['grand_total'] = remainingdata[i].draft.grand_total
                obj['item_count'] = remainingdata[i].draft.item_count
                savingData.push(obj)

            }
        }
        
        var wb = XLSX.utils.book_new();

        if (savingData.length == 0) {
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
            var OfflineDraft = XLSX.utils.sheet_add_aoa(wb, Heading, { origin: 'A1' });
        } else {
            var OfflineDraft = XLSX.utils.json_to_sheet(savingData)
        }
        XLSX.utils.book_append_sheet(wb, onlineSheetdata, 'All_Sheet')
        XLSX.utils.book_append_sheet(wb, OfflineDraft, 'OfflineDraft')
        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
        RNFS.writeFile(RNFS.DownloadDirectoryPath + '/Drafts.xlsx', wbout, 'ascii').then((r) => {
            let allsheet = XLSX.utils.sheet_to_json(onlineSheetdata, { header: 2 })
            let online = returnFormatedDraftData(allsheet, 'draft_id')
            let combine = online.concat(remainingdata)
            dispatch({ type: CHANGE_DRAFT, payload: combine })
        }).catch((e) => {
            console.log('Error DeleteDraftOffline', e);
        });
    })
}
export function returnFormatedDraftData(item, ConditionOn) {
    try {

        let indexes = []
        for (let i = 0; i < item.length; i++) {
            indexes.push(item[i][`${ConditionOn}`])  // Draft which are present in Database have a draft_id and in offline it has offlineDraftId
        }

        const uniqueIndex = [...new Set(indexes)]
        console.log(uniqueIndex)
        let Allsheet = []
        for (let j = 0; j < uniqueIndex.length; j++) {
            let data = []
            for (let i = 0; i < item.length; i++) {
                if (item[i][`${ConditionOn}`] == uniqueIndex[j]) {
                    data.push(item[i])
                }

            }
            Allsheet.push({
                draft: {
                    item_count: data[0].item_count,
                    grand_total: data[0].grand_total,
                    offlineDraftId: data[0].offlineDraftId

                },
                draft_items: data
            })
        }
        return Allsheet
    } catch (error) {
        console.log('returnFormatedDraftData function', error)
    }
}
