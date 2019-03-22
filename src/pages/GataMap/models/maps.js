import { approval,mappingList,grapList,tradeSuccess,tradeFail,uploadMap,giveUp,validGiveUp,cancelMap } from '@/services/maps';
import { message } from 'antd';


export default {
  namespace: 'maps',

  state: {
    data: {
      list: [],
      pagination: {},
      groupCount:{},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(mappingList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *grapList({ payload }, { call, put }) {
      const response = yield call(grapList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *uploadMap({ payload, callback }, { call, put }) {
      const response = yield call(uploadMap, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        message.success(response.msg);
        if (callback) callback();
      }else{
        message.error(response.msg);
      }
    },
    *cancelMap({ payload, callback }, { call, put }) {
      const response = yield call(cancelMap, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        message.success(response.msg);
        if (callback) callback();
      }else{
        message.error(response.msg);
      }
    },
    *tradeSuccess({ payload, callback }, { call, put }) {
      const response = yield call(tradeSuccess, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        message.success(response.msg);
        if (callback) callback();
      }else{
        message.error(response.msg);
      }

    },
    *tradeFail({ payload, callback }, { call, put }) {
      const response = yield call(tradeFail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        message.success(response.msg);
        if (callback) callback();
      }else{
        message.error(response.msg);
      }
    },
    *validGiveUp({ payload, callback }, { call, put }) {
      const response = yield call(validGiveUp, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        // message.success(response.msg);
        if (callback) callback(response);
      }else{
        message.error(response.msg);
      }
    },
    *giveUp({ payload, callback }, { call, put }) {
      const response = yield call(giveUp, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        message.success(response.msg);
        if (callback) callback();
      }else{
        message.error(response.msg);
      }

    },
    *approval({ payload, callback }, { call, put }) {
      const response = yield call(approval, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (response.code === 10000){
        message.success(response.msg);
        if (callback) callback();
      }else{
           message.error(response.msg);
      }

    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      console.log(action);
      const pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: action.payload.data.pageSize,
        total: action.payload.data.total,
      }
      const data = {...action.payload.data,pagination};
      console.log(data);
      return {
        ...state,
         data:data,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
