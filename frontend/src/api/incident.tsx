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