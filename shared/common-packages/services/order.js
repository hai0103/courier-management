import {Utility} from "utils/common";
import {request} from "utils/axios";

export const OrderApi = {
  async getList(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/order/search`,
      data,
      headers
    )
  },
  async getAll(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/order/all`,
      {},
      headers
    )
  },
  async getCountOrder(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/order/count-order`,
      data,
      headers
    )
  },
  async getCountMoneyOrder(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/order/count-money-order`,
      data,
      headers
    )
  },
  async calculatePrice(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/config-formula/calculate-postage`,
      data,
      headers
    )
  },
  async trackingOrder(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/order-history/get-history`,
      data,
      headers
    )
  },
  async create(data) {
    return await request(
      'POST',
      `${process.env.API_HOST}api/order/create`,
      data
    )
  },
  async findById(id, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/order/get-by-id/${id}`,
      {},
      headers
    )
  },
  async update(data) {
    return await request(
      'POST',
      `${process.env.API_HOST}api/order/update/${data.id}`,
      data.body
    )
  },
  async delete(id) {
    return await request(
      'POST',
      `${process.env.API_HOST}api/order/delete/${id}`
    )
  },
  async updateStatus(data = {}) {
    const {orderId, statusId, userId} = data;
    return await request(
      'POST',
      `${process.env.API_HOST}api/order/update-status?orderId=${orderId}&statusId=${statusId}&userId=${userId}`,
      {}
    )
  },
  async getConfigFormula(data, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/config-formula/all`,
      {},
      headers
    )
  },
  async updateConfigFormula(data = {}) {
    const {id, body} = data;
    return await request(
      'POST',
      `${process.env.API_HOST}api/config-formula/update/${id}`,
      body
    )
  },
}
