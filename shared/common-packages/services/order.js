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
      {},
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
      `${Utility.getRemoteHost(useInternal)}admin-query/company/find-by-id/${id}`,
      {},
      headers
    )
  },
  async update(data) {
    return await request(
      'POST',
      `${process.env.API_HOST}admin-command/company/update/${data.id}`,
      data
    )
  },
  async delete(id) {
    return await request(
      'POST',
      `${process.env.API_HOST}admin-command/company/delete/${id}`
    )
  },
  async updateStatus(id, data = {}) {
    return await request(
      'POST',
      `${process.env.API_HOST}admin-command/company/update-status/${id}`,
      data
    )
  },
}
