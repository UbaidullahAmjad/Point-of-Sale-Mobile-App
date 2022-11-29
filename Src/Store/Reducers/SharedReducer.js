import {
    CHANGE_LOADER,
    CHANGE_EXCEL_LOADER,
    DATA_SUCCESSFULLY_GET,
    CHANGE_EXCEL_FILE,
    CHANGE_INTERNET_LOADER
} from '../Actions/type'

const initialState = {
    loader: false,
    excelLoader: false,
    dataGated: false,
    excelReferencce: null,
    internetConnected:false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_INTERNET_LOADER:
            return {
                ...state,
                internetConnected: payload,
            };
        case CHANGE_EXCEL_FILE:
            return {
                ...state,
                excelReferencce: payload,
            };
        case DATA_SUCCESSFULLY_GET:
            return {
                ...state,
                dataGated: payload,
            };
        case CHANGE_EXCEL_LOADER:
            return {
                ...state,
                excelLoader: payload,
            };
        case CHANGE_LOADER:
            return {
                ...state,
                loader: payload,
            };

        default:
            return state;
    }
};