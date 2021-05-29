import { Utility } from "utils/common";
import { request } from "utils/axios";

export const ProcessStatusApi = {
  async getList(useInternal = false, headers) {
    return await request(
      'GET',
      `${Utility.getRemoteHost(useInternal)}api/process-status/all`,
      {},
      headers
    )
  },
}
