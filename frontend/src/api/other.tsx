import type { Status, Type, Sector } from "../models/models";

const API_URL = import.meta.env.VITE_API_URL;

interface StatusResponse {
    status: Array<Status>;
}

interface TypeResponse {
    type: Array<Type>;
}

interface SectorResponse {
    sector: Array<Sector>;
}

export const getStatus = async () => {
    const response = await fetch(`${API_URL}/api/status`, { credentials: "include" });
    if (!response.ok) {
        throw new Error("Ошибка получения статусов");
    }
    const data: StatusResponse = await response.json();
    return data;
}

export const getType = async () => {
    const response = await fetch(`${API_URL}/api/type`, { credentials: "include" });
    if (!response.ok) {
        throw new Error("Ошибка получения типов инцидентов");
    }
    const data: TypeResponse = await response.json();
    return data;
}

export const getSector = async () => {
    const response = await fetch(`${API_URL}/api/sector`, { credentials: "include" });
    if (!response.ok) {
        throw new Error("Ошибка получения секторов");
    }
    const data: SectorResponse = await response.json();
    return data;
}