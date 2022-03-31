import { stringify } from 'qs';
import request from '@/utils/request';

export async function querySend(params) {
  return request(`/api/v1/repo/sendout?${stringify(params)}`)
}

export async function queryBackDetail(params) {
  const id = params.id
  return request(`/api/v1/repo/sendout/${id}/get_comebacks`)
}

export async function addSend(params) {
  return request('/api/v1/repo/sendout', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function backSend(params){
  const id = params.id
  return request(`/api/v1/repo/sendout/${id}/bring_back`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function deleteSend(params){
  const id = params.id
  return request(`/api/v1/repo/sendout/${id}`, {
    method: 'DELETE',
    body:{
      ...params,}
  })
}

export async function deleteSendRecord(params){
  const id = params.id
  return request(`/api/v1/repo/sendrecord/${id}`, {
    method: 'DELETE',
    body: {
      ...params,
    }
  })
}

export async function changeSendStatus(params){
  const id = params.id
  return request(`/api/v1/repo/sendout/${id}/change_status`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function queryOrder(params){
  return request(`/api/v1/repo/order?${stringify(params)}`)
}

export async function addOrder(params){
  return request('/api/v1/repo/order', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function deleteOrder(params){
  const id = params.id
  return request(`/api/v1/repo/order/${id}`, {
    method: 'DELETE',
    body: {
      ...params,
    }
  })
}

export async function backOrder(params){
  const id = params.id
  return request(`/api/v1/repo/order/${id}/bring_back`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function deleteOrderRecord(params){
  const id = params.id
  return request(`/api/v1/repo/orderrecord/${id}`, {
    method: 'DELETE',
    body: {
      ...params,
    }
  })
}

export async function queryOrderDetail(params) {
  const id = params.id
  return request(`/api/v1/repo/order/${id}/get_comebacks`)
}

export async function changeOrderStatus(params){
  const id = params.id
  return request(`/api/v1/repo/order/${id}/change_status`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function queryShop(params) {
  return request(`/api/v1/repo/shop?${stringify(params)}`)
}

export async function changeShopNum(params) {
  const id = params.id
  return request(`/api/v1/repo/shop/${id}/change_num`,{
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function deleteShopRecord(params){
  const id = params.id;
  return request(`/api/v1/repo/shoprecord/${id}`, {
    method: 'DELETE',
    body: {
      ...params,
    }
  })
}

export async function queryProduct(params){
  return request(`/api/v1/repo/product?${stringify(params)}`)
}

export async function addShop(params){
  return request('/api/v1/repo/shop', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function setThreshold(params){
  const id = params.id
  return request(`/api/v1/repo/shop/${id}/set_threshold`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function addProduct(params){
  return request('/api/v1/repo/product', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function updateProduct(params){
  const id = params.id
  return request(`/api/v1/repo/product/${id}/partial_change`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function queryCommodity(params){
  return request(`/api/v1/repo/commodity?${stringify(params)}`)
}

export async function addCommodity(params){
  return request('/api/v1/repo/commodity', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function updateCommodity(params){
  const id = params.id
  return request(`/api/v1/repo/commodity/${id}/partial_change`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function querySaleRecord(params){
  return request(`/api/v1/repo/salerecord?${stringify(params)}`)
}

export async function addSaleRecord(params){
  const id = params.id
  return request(`/api/v1/repo/product/${id}/add_sale`, {
    method: 'PUT',
    body: {
      ...params,
    }
  })
}

export async function deleteSaleRecord(params){
  const id = params.id
  return request(`/api/v1/repo/salerecord/${id}`,{
    method: 'DELETE',
    body: {
      ...params,
    }
  })
}

export async function queryShopRecord(params){
  return request(`/api/v1/repo/shoprecord?${stringify(params)}`)
}

export async function getRecord(params){
  return request(`/api/v1/repo/productrecord/record?${stringify(params)}`)
}

export async function getShopDetail(params){
  const id = params.id
  return request(`/api/v1/repo/shop/${id}/detail_num`)
}

export async function userLogout(params){
  return request(`/api/v1/logout`)
}

export async function userLogin(params){
  return request(`/api/v1/login`, {
    method: 'POST',
    body: {
      ...params,
    }
  })
}
