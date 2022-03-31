import {addProduct, queryProduct, addSaleRecord, updateProduct, getRecord } from '@/services/api';

export default {
  namespace: 'product',

  state: {
    data: {
      results: [],
      count: 10,
    },

    record: []
  },

  effects: {
    *fetch({payload}, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *add({payload, callback}, {call, put}){
      const response = yield call(addProduct, payload);
      if (callback) callback();
    },

    *update({payload, callback}, {call, put}){
      const response = yield call(updateProduct, payload);
      if (callback) callback();
    },
    
    *sale({ payload, callback },{ call, put }){
      const response = yield call(addSaleRecord, payload);
      if(callback) callback();
    },

    *fetchRecord({payload}, {call, put}){
      const response = yield call(getRecord, payload);
      yield put({
        type: 'saveRecord',
        payload: response,
      })
    }
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
