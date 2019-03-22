import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { validAccountLogin,accountLongout } from '@/services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    userId:undefined,
    userName:undefined,
    userPhone:undefined,
    userEmail:undefined,
    userPhoto:undefined,
    userType:undefined,
    userLevel:undefined,
    token:undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(validAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ payload }, { call,put }) {
      yield call(accountLongout,payload);
      yield put({
        type: 'loginOutStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentAuthority);
      localStorage.setItem("localToken",payload.data.token);
      return {
        ...state,
        status: payload.status,
        userId: payload.data.userId,
        userName:payload.data.userName,
        userPhone:payload.data.userPhone,
        userEmail:payload.data.userEmail,
        userPhoto:payload.data.userPhoto,
        userType:payload.data.userType,
        userLevel:payload.data.userLevel,
        token:payload.data.token,
      };
    },
    loginOutStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        userId: undefined,
        userName:undefined,
        userPhone:undefined,
        userEmail:undefined,
        userPhoto:undefined,
        userType:undefined,
        userLevel:undefined,
        token:undefined,
      };
    },
  },
};
