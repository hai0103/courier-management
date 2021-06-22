export default class Response {
    static isSuccess(response) {
        return response.status && response.status === 200;
    }

    static isSuccessCode(response) {
        return (response.code && response.code === 200) || (response.data.code && response.data.code === 200);
    }

    static isSuccessAPI(response) {
        return (this.isSuccess(response) && response.data && response.data.Success === true) || this.isSuccessCode(response);
    }

    static getErrorMessage(error) {
        if (!error.response) {
            return error.message;
        }

        return error.response.data?.message || error.message;
    }

    static getData(response) {
        if (this.isSuccess(response)) {
            return response.data;
        }

        throw new Error('Can not get data from response');
    }

    static getAPIData(response) {
        if (this.isSuccessAPI(response) && response.data.data) {
            return response.data.data;
        }

        if (this.isSuccessAPI(response) && response.data.data === 0) {
            return 0;
        }

        throw new Error('Can not get data from response');
    }

    static getAPIError(response) {
        if (!this.isSuccessAPI(response) && response.data.message && response.data.message[0]) {
            return response.data.message[0];
        }

        throw new Error('Can not get error message from response');
    }
    static getAPIErrorV1(response) {
        return response.data.messageError;
    }
}
