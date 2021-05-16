import { APP_SETTINGS } from 'constants/common';
import i18n from 'i18n';
import { confirmAlert } from 'react-confirm-alert';
import ModalConfirmation from "sharedComponents/modal/confirmation";
import React from "react";
import {AssetApi} from "services/asset";

export function trans(key, data = {}, namespace = 'common') {
    return i18n.t(`${namespace}:${key}`, data);
}

export function title(key, suffix = APP_SETTINGS.NAME) {
    return trans(key) + ' - ' + suffix;
}

export function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function isNotNullAndUndefined(value) {
    return value !== null && value !== undefined
}

export function confirmation(options) {
    const defaultOptions = {
        // eslint-disable-next-line react/prop-types
        customUI: ({ onClose }) => <ModalConfirmation
            show={true}
            title={options.title}
            onClose={onClose}
            content={options.content || ''}
            onConfirm = {() => {
                if (options.onConfirm) {
                    options.onConfirm({onClose});
                }
            }}
            confirmButtonLabel={options.confirmLabel || trans('common.button.confirm')}
            cancelButtonLabel={options.cancelLabel || trans('common.button.cancel')}
        />,
    };

    confirmAlert(defaultOptions);
}

export function download(id, name) {
    AssetApi.download(id).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name || 'unNamed');
        document.body.appendChild(link);
        link.click();
    })
}