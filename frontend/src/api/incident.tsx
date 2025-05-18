import type { IncidentListItem } from "../models/models";

const API_URL = import.meta.env.VITE_API_URL;

interface IncidentsResponse {
    incidents: Array<IncidentListItem>
    total: number;
}

export const getIncidentsBySectorID = async (id: number, page: number, limit: number) => {
    const res = await fetch(`${API_URL}/api/incident?sector_id=${id}&page=${page}&limit=${limit}`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw Error("Ошибка при получении инцидентов")
    }

    const data: IncidentsResponse = await res.json();
    return data;
};

export const getIncident = async (id: number) => {
    const res = await fetch(`${API_URL}/api/incident/${id}`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw Error("Ошибка при получении инцидентов")
    }

    return await res.json();
};

export const createIncident = async (body: Object) => {
    const res = await fetch(`${API_URL}/api/incident`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw Error("Ошибка при создании инцидента")
    }

};

export const deleteIncident = async (id: number) => {
    const res = await fetch(`${API_URL}/api/incident?id=${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Ошибка при удалении инцидента");
    }

    return await res.json();
};
