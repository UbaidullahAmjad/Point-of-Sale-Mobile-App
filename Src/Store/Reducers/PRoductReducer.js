import {
    CHANGE_CATEGORY,
    CHANGE_PRODUCT,
    CHANGE_CATEGORY_LOADER,
    CHANGE_PRODUCT_LOADER,
    CHANGE_SALES_PRODUCTS,
    CHANGE_PAGE_NUMBER,
    CHANGE_NEXT_PAGE
} from '../Actions/type'

const initialState = {
    Product: [],
    category: [],
    productLoader: false,
    categoryLoader: false,
    sale_Products: [],
    pageNumber: 1,
    nextPage: true,
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_PRODUCT_LOADER:
            return {
                ...state,
                productLoader: payload,
            };
        case CHANGE_CATEGORY_LOADER:
            return {
                ...state,
                categoryLoader: payload,
            };
        case CHANGE_PRODUCT:
            return {
                ...state,
                Product: payload,
            };
        case CHANGE_CATEGORY:
            return {
                ...state,
                category: payload,
            };
        case CHANGE_SALES_PRODUCTS:
            return {
                ...state,
                sale_Products: payload,
            };
        case CHANGE_PAGE_NUMBER:
            return {
                ...state,
                pageNumber: payload,
            };
        case CHANGE_NEXT_PAGE:
            return {
                ...state,
                nextPage: payload,
            };
        default:
            return state;
    }
};