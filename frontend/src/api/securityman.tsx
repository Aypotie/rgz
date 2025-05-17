import type { UserInfo } from "../models/models";

const API_URL = import.meta.env.VITE_API_URL;


export const getUser = async () => {
    const res = await fetch(`${API_URL}/api/securityman`, {
        credentials: "include"
    });
    if (!res.ok) {
        throw Error("error getting user");
    }
    const data: UserInfo = await res.json();

    return data;
};

export const logoutUser = async () => {
    const res = await fetch(`${API_URL}/api/securityman/logout`, {
        credentials: "include"
    });
    if (!res.ok) {
        throw Error("error getting user");
    }
}