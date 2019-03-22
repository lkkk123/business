import { getAtlasList,addAtlas,updateAtlas,updateStatusByAtlas,getAllCategory } from '@/services/atlas';
import { message } from 'antd';


export default {
  namespace: 'atlas',

  state: {
    categorys:[],
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAtlasList, payload);
      yield put({
        type: 'getAtlasList',
        payload: response,
      });
    },
    *getAllCategory({ payload }, { call, put }) {
      const response = yield call(getAllCategory, payload);
      yield put({
        type: 'pushCate',
        payload: response,
      });
    },
    *addAtlas({ payload, callback }, { call, put }) {
      const response = yield call(addAtlas, payload);
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
    *updateAtlas({ payload, callback }, { call, put }) {
      const response = yield call(updateAtlas, payload);
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
    *updateStatusByAtlas({ payload, callback }, { call, put }) {
      const response = yield call(updateStatusByAtlas, payload);
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
  },

  reducers: {
    getAtlasList(state, action) {
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
    pushCate(state, action) {
      const payload = {...action.payload};
      console.log(payload);
      return {
        ...state,
        categorys: payload.data || [],
      };
    },
  },
};
