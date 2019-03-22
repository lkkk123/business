import request from '@/utils/request';
import settings from '@/defaultSettings';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(settings.serverUrl+`/user/userInfoByToken`);
}

export async function validAccountLogin(params) {
  return request(settings.serverUrl+'/user/login2WeChat', {
    method: 'POST',
    body: params,
  });
}

export async function accountLongout(params) {
  return request(settings.serverUrl+'/user/loginOut', {
    method: 'POST',
    body: params,
  });
}
