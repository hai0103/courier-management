import { Utility } from "utils/common";
import { request } from "utils/axios";
import {API_HOST} from "../../../constants/common";

const SYSTEM_FRAME_ID = '111111-111111'

export const PermissionApi = {
  async getSystemRoles(data = {}, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/user-type/all`,
      { },
      headers
    )
  },
  async getPositionRoles(data = {}, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}auth-query/role/get-list-role`,
      {
        type: 'POSITION',
        ...data
      },
      headers
    )
  },
  async getPermissionFrame(data = {}, useInternal = false, headers = {}) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/permission/get-permission-roles`,
      {},
      headers
    )
  },
  async assignSystemPermission(data) {
    const {userTypeId, permissionId, status} = data;
    return await request(
      'POST',
      `${API_HOST}api/permission/on-assign?userTypeId=${userTypeId}&permissionId=${permissionId}&status=${status}`,
      data
    )
  },
  async assignBusinessPermission(frameId, data) {
    return await request(
      'POST',
      `${API_HOST}auth-command/permission-frame/${frameId}/switch-status-business-permission`,
      data
    )
  },
}
