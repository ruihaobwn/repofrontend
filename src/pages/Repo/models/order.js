import { queryOrder, deleteOrder, addOrder, backOrder, queryOrderDetail, changeOrderStatus, deleteOrderRecord } from '@/services/api';

export default {
  namespace: 'order',

  state: {
    data: {
      results: [],
      count: 10,
    },
   // 单个归还详情
//   comeBacks: {
//     comebacks: undefined
//   },
    comeBacks: undefined
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *changeStatus({ payload, callback }, { call, put }){
      const response = yield call(changeOrderStatus, payload);
      if(callback) callback();
    },

    *fetchBackDetail({payload}, {call, put}){
      const response = yield call(queryOrderDetail, payload);
      yield put({
        type: 'saveBack',
        payload: response,
      });
    },

    *add({payload, callback},{call, put}) {
      const response = yield call(addOrder, payload);
      if(callback) callback();
    },
    
    *delete({payload, callback},{call, put}){
      const response = yield call(deleteOrder, payload);
      if(callback) callback();
    },
    
    *reback({payload, callback}, {call, put}){
      const response = yield call(backOrder, payload);
      if(callback) callback();
    },

    *deleteRecord({payload, callback},{call, put}){
      const response = yield call(deleteOrderRecord, payload)
      if (callback) callback();
    }
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
