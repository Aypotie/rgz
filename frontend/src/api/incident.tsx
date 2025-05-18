import type { Incident } from "../models/models";

const API_URL = import.meta.env.VITE_API_URL;

interface IncidentsResponse {
    incidents: Array<Incident>
}

export const getIncidents = async () => {
    const res = await fetch(`${API_URL}/api/incident`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw Error("Ошибка при получении инцидентов")
    }

    const data: IncidentsResponse = await res.json();
    return data;
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
