import { queryCategory,addCategory,updateCategory,upCateStatus } from '@/services/atlas';
import { message } from 'antd';


export default {
  namespace: 'caty',

  state: {
    data: {
      list: [],
      pagination: {},
      groupCount:{},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      yield put({
        type: 'queryCategory',
        payload: response,
      });
    },
    *addCategory({ payload, callback }, { call, put }) {
      const response = yield call(addCategory, payload);
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
    *updateCategory({ payload, callback }, { call, put }) {
      const response = yield call(updateCategory, payload);
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
    *upCateStatus({ payload, callback }, { call, put }) {
      const response = yield call(upCateStatus, payload);
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
    queryCategory(state, action) {
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
    }
  },
};
