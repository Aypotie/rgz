import type { Status, Type } from "../models/models";

const API_URL = import.meta.env.VITE_API_URL;

interface StatusResponse {
    status: Array<Status>;
}

interface TypeResponse {
    type: Array<Type>;
}

export const getStatus = async () => {
    const response = await fetch(`${API_URL}/api/status`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data: StatusResponse = await response.json();
    return data;
}

export const getType = async () => {
    const response = await fetch(`${API_URL}/api/type`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data: TypeResponse = await response.json();
    return data;
}
