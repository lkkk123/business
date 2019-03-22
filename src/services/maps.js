import { stringify } from 'qs';
import request from '@/utils/request';
import settings from '@/defaultSettings';

export async function queryList(params) {
  return request(settings.serverUrl+`/gata_map/queryList?${stringify(params)}`);
}

export async function mappingList(params) {
  return request(settings.serverUrl+`/business/mappingList?${stringify(params)}`);
}

export async function grapList(params) {
  return request(settings.serverUrl+`/business/grapList?${stringify(params)}`);
}
// 取消打图
export async function cancelMap(params) {
  return request(settings.serverUrl+'/business/cancelMap', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 设计师上传成品
export async function uploadMap(params) {
  return request(settings.serverUrl+'/business/uploadMap', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 验收通过，交易完成
export async function tradeSuccess(params) {
  return request(settings.serverUrl+'/business/tradeSuccess', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 验收失败
export async function tradeFail(params) {
  return request(settings.serverUrl+'/business/tradeFail', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 放弃任务校验
export async function validGiveUp(params) {
  return request(settings.serverUrl+`/business/validGiveUp?${stringify(params)}`);
}

// 放弃任务
export async function giveUp(params) {
  return request(settings.serverUrl+'/business/giveUp', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function approval(params) {
  return request(settings.serverUrl+'/gata_map/approval', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
