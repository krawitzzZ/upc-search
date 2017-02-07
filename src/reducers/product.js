import moment from 'moment';

const LOAD_PRODUCT = 'TestApp/LOAD_PRODUCT';
const LOAD_PRODUCT_SUCCESS = 'TestApp/LOAD_PRODUCT_SUCCESS';
const LOAD_PRODUCT_FAIL = 'TestApp/LOAD_PRODUCT_FAIL';

const CLEAR = 'TestApp/CLEAR';

const initState = {
  loadingProduct: false,
  loadingError: null,
  info: null,
};

export default function product(state = initState, action) {
  switch (action.type) {
    case LOAD_PRODUCT:
      return {
        ...state,
        loadingProduct: true,
        loadingError: null,
        info: null,
      };

    case LOAD_PRODUCT_SUCCESS:
      return {
        ...state,
        loadingProduct: false,
        info: action.data,
      };

    case LOAD_PRODUCT_FAIL:
      return {
        ...state,
        loadingProduct: false,
        loadingError: action.error,
      };

    case CLEAR:
      return {
        ...initState,
      };

    default:
      return state;
  }
}

export function fetchProductInfo(itemId, type) {
  return {
    types: [LOAD_PRODUCT, LOAD_PRODUCT_SUCCESS, LOAD_PRODUCT_FAIL],
    promise: api => api.getAWS(`/onca/xml`, {
      query: {
        'Service': 'AWSECommerceService',
        'Operation': 'ItemLookup',
        'ResponseGroup': 'Small',
        'SearchIndex': 'All',
        'IdType': type,
        'ItemId': itemId,
        'Timestamp': moment().toISOString(),
      }
    }),
  };
}

export function clearInfo() {
  return {
    type: CLEAR,
  };
}
