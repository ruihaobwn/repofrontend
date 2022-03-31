import {querySaleRecord, deleteSaleRecord} from '@/services/api';

export default {
  namespace: 'salerecord',

  state: {
    data: {
      results: [],
      count: 10,
    },

    record: []
  },

  effects: {
    *fetch({payload}, { call, put }) {
      console.log(2)
      const response = yield call(querySaleRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *delete({ payload, callback }, { call, put }){
      const response = yield call(deleteSaleRecord, payload);
      if (callback) callback();
    },

//    *update({payload, callback}, {call, put}){
//      console.log(payload)
//      const response = yield call(updateCommodity, payload);
//      if (callback) callback();
//    },
//    
//    *fetchRecord({payload}, {call, put}){
//      const response = yield call(getRecord, payload);
//      yield put({
//        type: 'saveRecord',
//        payload: response,
//      })
//    }
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
