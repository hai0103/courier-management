export const RESPONSE_CODE = {

}

export const ERROR_CODE = {
    USER_BLOCKED: 'AUTH.USER_BLOCKED',
    USER_PASSWORD_EXPIRED: 'AUTH.PASSWORD_EXPIRED',
}

export const SERVICE_STATUS_CODE = {
    UN_AUTHORIZE: 401,
    FORBIDDEN: 403
}

export const ROUTES = {
    LOGOUT: '/logout',
};

export const HISTORY_ACTION = {
    CREATED: 'CREATED',
    UPDATED: 'UPDATED',
    BLOCKED: 'BLOCKED',
    UNBLOCKED: 'UNBLOCKED',
    DELETED: 'DELETED',
    TURNED_OFF: 'TURNED_OFF',
    TURNED_ON: 'TURNED_ON',
    HIERARCHY_UPDATED: 'HIERARCHY_UPDATED',
    DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
    DOCUMENT_DELETED: 'DOCUMENT_DELETED',
}

export const MIME_TYPE = {
    IMAGE: 'image/*',
    PDF: 'application/pdf',
    WORD: 'application/msword',
    WORD_X: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    EXCEL: 'application/vnd.ms-excel',
    EXCEL_X: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ZIP: 'application/zip,application/x-zip-compressed,multipart/x-zip',
    ZIP_7z: 'application/x-7z-compressed',
    RAR: 'application/x-rar-compressed',
}

export const DATE_FORMAT = 'DD/MM/YY'