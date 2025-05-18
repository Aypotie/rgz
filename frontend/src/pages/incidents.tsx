import { useEffect, useState } from "react";
import type { Incident } from "../models/models";
import { getIncidents } from "../api/incident";
import { normolizeTime } from "../utils/utils";
import { deleteIncident } from "../api/incident"; // уже импортируем getIncidents
import { toast } from "react-toastify";


export const IncidentsBySector = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const fetchIncidents = async () => {
            setIncidents((await getIncidents()).incidents);
        }

        fetchIncidents();
    }, []);

    const grouped = incidents.reduce<Record<string, Incident[]>>((acc, incident) => {
        acc[incident.sector] = acc[incident.sector] || [];
        acc[incident.sector].push(incident);
        return acc;
    }, {});

    const handleDelete = async (id: number) => {
        try {
            await deleteIncident(id);
            setIncidents(prev => prev.filter(i => i.id !== id));
        } catch (err: any) {
            toast.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Инциденты по секторам</h2>
            <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "1rem" }}>
                {Object.keys(grouped).sort().map(sector => (
                    <div key={sector} className="mb-4">
                        <h4>Сектор {sector}</h4>
                        <ul className="list-group">
                            {grouped[sector].map(incident => (
                                <li key={incident.id} className="list-group-item d-flex justify-content-between align-items-start">
                                    <div>
                                        <strong>{normolizeTime(incident.incident_time)}</strong>:
                                        <span className="ms-2">{incident.description}</span><br />
                                        <span className="ms-2">Статус: {incident.status}</span>
                                    </div>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(incident.id)}>
                                        Удалить
                                    </button>
                                </li>

                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );

};
