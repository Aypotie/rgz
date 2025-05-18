import type { UserInfo } from "../models/models";

const API_URL = import.meta.env.VITE_API_URL;

interface Response {
    error?: string;
}

export const getUser = async () => {
    const res = await fetch(`${API_URL}/api/securityman`, {
        credentials: "include"
    });
    if (!res.ok) {
        throw Error("ошибка получения пользователя");
    }
    const data: UserInfo = await res.json();

    return data;
};

export const logoutUser = async () => {
    const res = await fetch(`${API_URL}/api/securityman/logout`, {
        credentials: "include"
    });
    if (!res.ok) {
        throw Error("ошибка при выходе пользователя");
    }
}

export const loginUser = async (phone: string, password: string) => {
    const res = await fetch(`${API_URL}/api/securityman/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "phone": phone, "password": password })
    });

    if (!res.ok) {
        const data: Response = await res.json();
        if (data.error) {
            throw Error(data.error);
        }
    }
}