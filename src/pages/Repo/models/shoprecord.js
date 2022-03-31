import {queryShopRecord, deleteShopRecord} from '@/services/api';

export default {
  namespace: 'shoprecord',

  state: {
    data: {
      results: [],
      count: 10,
    },

    record: []
  },

  effects: {
    *fetch({payload}, { call, put }) {
      const response = yield call(queryShopRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *delete({payload, callback},{call, put}){
      const response = yield call(deleteShopRecord, payload);
      if (callback) callback();
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveRecord(state, action){
      return {
        ...state,
        record: action.payload,
      }
    }
  },
};
