import { useEffect, useState } from "react";
import { type Sector, type Incident, type IncidentListItem } from "../models/models";
import { getIncident, deleteIncident, getIncidentsBySectorID } from "../api/incident";
import { normolizeTime } from "../utils/utils";
import { toast } from "react-toastify";
import { Selector } from "../components/Selector";
import { Pagination } from "../components/Pagination";
import { getSector } from "../api/other";

const PAGE_SIZE = 5;

export const IncidentsBySector = () => {
    const [incidents, setIncidents] = useState<IncidentListItem[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [detailedIncident, setDetailedIncident] = useState<Incident | null>(null);
    const [sectors, setSectors] = useState<Array<Sector> | null>(null);
    const [selectedSector, setSelectedSector] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalIncidents, setTotalIncidents] = useState<number>(0);

    useEffect(() => {
        const fetchIncidents = async () => {
            if (selectedSector !== null) {
                try {
                    const incidentsData = await getIncidentsBySectorID(selectedSector, currentPage, PAGE_SIZE);
                    setIncidents(incidentsData.incidents);
                    setTotalIncidents(incidentsData.total);
                    setExpandedId(null);
                    setDetailedIncident(null);
                } catch (err) {
                    toast.error("Ошибка при загрузке инцидентов");
                    setIncidents([]);
                }
            }
        };
        fetchIncidents();
    }, [selectedSector, currentPage]);

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const sectors = (await getSector()).sector;
                if (sectors.length > 0) setSelectedSector(sectors[0].id);
                setSectors(sectors);
            } catch (e: any) {
                toast.error(e.message);
            }
        };
        fetchSectors();
    }, []);

    const handleToggle = async (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setDetailedIncident(null);
        } else {
            try {
                const detail = await getIncident(id);
                setExpandedId(id);
                setDetailedIncident(detail);
            } catch (err: any) {
                toast.error(err.message);
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteIncident(id);
            setIncidents(prev => prev.filter(i => i.id !== id));
            if (expandedId === id) {
                setExpandedId(null);
                setDetailedIncident(null);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Инциденты по секторам</h2>
            {sectors && <Selector data={sectors} label="Сектор" setSelectedElement={setSelectedSector} selectedValue={selectedSector}></Selector>}
            <div className="mb-4">
                <ul className="list-group">
                    {incidents.map(incident => (
                        <li key={incident.id} className="list-group-item">
                            <div
                                className="d-flex justify-content-between align-items-start"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleToggle(incident.id)}
                            >
                                <div>
                                    <strong>{normolizeTime(incident.incident_time)}</strong>:
                                    <span className="ms-2">{incident.description}</span><br />
                                    <span className="ms-2">Статус: {incident.status}</span>
                                </div>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(incident.id);
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>

                            {expandedId === incident.id && detailedIncident && (
                                <div className="mt-2 ms-2">
                                    <div>Тип: {detailedIncident.type}</div>
                                    <div>Критичность: {detailedIncident.critical_level}</div>
                                    <div>Охранник: {detailedIncident.securityman_name}</div>
                                    <div>Создано: {normolizeTime(detailedIncident.created_at)}</div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <Pagination pageSize={PAGE_SIZE} total={totalIncidents} setCurrentPage={setCurrentPage} currentPage={currentPage}></Pagination>
        </div>
    );
};
