import { querySend, addSend, backSend, deleteSend, deleteSendRecord, queryBackDetail, changeSendStatus } from '@/services/api';

export default {
  namespace: 'send',

  state: {
    data: {
      results: [],
      count: 10,
    },
   // 单个归还详情
    comeBacks: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySend, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchBackDetail({payload}, {call, put}){
      const response = yield call(queryBackDetail, payload);
      yield put({
        type: 'saveBack',
        payload: response,
      });
    },

    *changeStatus({ payload, callback }, { call, put }){
      const response = yield call(changeSendStatus, payload);
      if(callback) callback();                                                                                                                                                                  
    },

    *add({payload, callback},{call, put}) {
      const response = yield call(addSend, payload);
      if(callback) callback();
    },
    
    *reback({payload, callback}, {call, put}){
      const response = yield call(backSend, payload);
      if(callback) callback();
    },
    
    *delete({payload, callback}, {call, put}){
      const response = yield call(deleteSend, payload);
      if (callback) callback();
    },

    *deleteRecord({payload, callback}, {call, put}){
      const response = yield call(deleteSendRecord, payload);
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
    saveBack(state, action){
      return {
        ...state,
        comeBacks: action.payload,
      } 
    } 
  },
};
