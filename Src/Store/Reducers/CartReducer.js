import {
    CHANGE_CART,
    CHANGE_DRAFT,
    INVOICE_DATA,
    INVOICE_ITEMS,
    PRINT_SLIP_MODAL
} from '../Actions/type'

const initialState = {
    cart: [],
    draft: [],
    invoiceData: {},
    invoiceItems: [],
    prinstSlipModal:false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case PRINT_SLIP_MODAL:
            return {
                ...state,
                prinstSlipModal: payload,
            };
        case INVOICE_ITEMS:
            return {
                ...state,
                invoiceItems: payload,
            };
        case INVOICE_DATA:
            return {
                ...state,
                invoiceData: payload,
            };
        case CHANGE_DRAFT:
            return {
                ...state,
                draft: payload,
            };
        case CHANGE_CART:
            return {
                ...state,
                cart: payload,
            };
        default:
            return state;
    }
};