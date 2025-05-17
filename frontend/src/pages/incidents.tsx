import { useEffect, useState } from "react";
import type { Incident } from "../models/models";

export const IncidentsBySector = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incidents`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await res.json();
                setIncidents(data.incidents); // Предполагается, что API возвращает { incidents: [...] }
            } catch (error) {
                console.error("Ошибка при загрузке инцидентов", error);
            }
        };

        fetchIncidents();
    }, []);

    const grouped = incidents.reduce<Record<string, Incident[]>>((acc, incident) => {
        acc[incident.sector] = acc[incident.sector] || [];
        acc[incident.sector].push(incident);
        return acc;
    }, {});

    return (
        <div className="container mt-4">
            <h2>Инциденты по секторам</h2>
            {Object.keys(grouped).sort().map(sector => (
                <div key={sector} className="mb-4">
                    <h4>Сектор {sector}</h4>
                    <ul className="list-group">
                        {grouped[sector].map(incident => (
                            <li key={incident.id} className="list-group-item">
                                <strong>{incident.datetime}</strong>: {incident.description} —
                                <span className="ms-2">Статус: {incident.status}</span>,
                                <span className="ms-2">Тип: {incident.type}</span>,
                                <span className="ms-2">Опасность: {incident.danger}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
