import { useEffect, useState } from "react";
import type { Incident } from "../models/models";
import { getIncidents } from "../api/incident";
import { normolizeTime } from "../utils/utils";

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

    return (
        <div className="container mt-4">
            <h2>Инциденты по секторам</h2>
            {Object.keys(grouped).sort().map(sector => (
                <div key={sector} className="mb-4">
                    <h4>Сектор {sector}</h4>
                    <ul className="list-group">
                        {grouped[sector].map(incident => (
                            <li key={incident.id} className="list-group-item">
                                <strong>{normolizeTime(incident.incident_time)}</strong>:
                                <span className="ms-2">{incident.description}</span><br></br>
                                <span className="ms-2">Статус: {incident.status}</span>


                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
