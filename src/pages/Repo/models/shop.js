import { queryShop, addShop, changeShopNum, setThreshold, getShopDetail } from '@/services/api';

export default {
  namespace: 'shop',

  state: {
    data: {
      results: []
    },
    // 单个归还详情
    comeBacks: {},
    detailNum: {} 
  },

  effects: {
    *fetch({payload}, { call, put }) {
      const response = yield call(queryShop, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    //添加类别
    *add({payload, callback},{call, put}){
      const response = yield call(addShop, payload);
      if (callback) callback();
    },

    *change_num({payload, callback}, {call, put}){
      const response = yield call(changeShopNum, payload);
      if (callback) callback();
    },

    *setThreshold({payload, callback}, {call, put}){
      const response = yield call(setThreshold, payload);
      if (callback) callback();
    },

    *fetchDetail({payload, callback}, {call, put}){
      const response = yield call(getShopDetail, payload);
      yield put({
        type: 'saveDetailNum',
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

    saveDetailNum(state, action){
      return {
        ...state,
        detailNum: action.payload,
      }
    }
  },
};
