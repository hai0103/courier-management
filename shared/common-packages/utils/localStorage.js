const userProfileKey = 'user-profile';
const userPermissionKey = 'user-permissions';

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