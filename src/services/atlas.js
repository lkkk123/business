import { stringify } from 'qs';
import request from '@/utils/request';
import settings from '@/defaultSettings';

export async function queryCategory(params) {
  return request(settings.serverUrl+`/atlas/getAtlasCategory?${stringify(params)}`);
}
export async function buyImgList(params) {
  return request(settings.serverUrl+`/business/buyImgList?${stringify(params)}`);
}
export async function addCategory(params) {
  return request(settings.serverUrl+'/atlas/addCategroy', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function upCateStatus(params) {
  return request(settings.serverUrl+'/atlas/updateStatusByCategpry', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function updateCategory(params) {
  return request(settings.serverUrl+'/atlas/updateCategroy', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function getAtlasList(params) {
  return request(settings.serverUrl+`/atlas/getAtlasList?${stringify(params)}`);
}

export async function getAllCategory() {
  return request(settings.serverUrl+`/atlas/getAllCategory`);
}

export async function addAtlas(params) {
  return request(settings.serverUrl+'/atlas/addAtlas', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateAtlas(params) {
  return request(settings.serverUrl+'/atlas/updateAtlas', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateStatusByAtlas(params) {
  return request(settings.serverUrl+'/atlas/updateStatusByAtlas', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
