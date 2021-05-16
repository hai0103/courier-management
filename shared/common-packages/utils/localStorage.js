const userProfileKey = 'user-profile';
const userPermissionKey = 'user-permissions';

export function storeData(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

export function getData(name) {
    const data = localStorage.getItem(name);
    return JSON.parse(data);
}

export function removeData(name) {
    if (typeof localStorage !== 'undefined') {
        return localStorage.removeItem(name);
    }
}

export function storeUserProfile(user) {
    localStorage.setItem(userProfileKey, JSON.stringify(user));
}

export function getUserProfile() {
    const data = localStorage.getItem(userProfileKey);
    return JSON.parse(data);
}

export function removeUserProfile() {
    if (typeof localStorage !== 'undefined') {
        return localStorage.removeItem(userProfileKey);
    }
}

export function storeUserPermissions(permissions) {
    localStorage.setItem(userPermissionKey, JSON.stringify(permissions));
}

export function getUserPermissions() {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem(userPermissionKey);
        return JSON.parse(data);
    }
}

export function removeUserPermissions() {
    if (typeof localStorage !== 'undefined') {
        return localStorage.removeItem(userPermissionKey);
    }
}
