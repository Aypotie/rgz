import { useEffect, useState } from "react";
import type { Status, Type } from "../models/models";
import { getStatus, getType } from "../api/other";
import { createIncident } from "../api/incident";
import { toast } from 'react-toastify';
import { Selector } from "../components/Selector";
import { CriticalLevel } from "../components/CriticalLevel";


export const CreateIncident = () => {
    const [statuses, setStatuses] = useState<Array<Status> | null>(null);
    const [types, setTypes] = useState<Array<Type> | null>(null);
    const [dangerLevel, setDangerLevel] = useState<number | null>(null);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [maxDateTime, setMaxDateTime] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    const [selectedIncidentType, setSelectedIncidentType] = useState<number>(0);

    useEffect(() => {
        const now = new Date();
        const formatted = now.toLocaleString().slice(0, 16);
        setMaxDateTime(formatted);

        const fetchStatuses = async () => {
            try {
                const response = await getStatus();
                if (response.status.length > 0) setSelectedStatus(response.status[0].id);
                setStatuses(response.status);
            } catch (e: any) {
                toast.error(e.message);
            }
        };
        const fetchTypes = async () => {
            try {
                const response = await getType();
                if (response.type.length > 0) setSelectedIncidentType(response.type[0].id);
                setTypes(response.type);
            } catch (e: any) {
                toast.error(e.message);
            }
        };

        fetchTypes();
        fetchStatuses();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        if (!selectedZone) {
            alert("Пожалуйста, выберите сектор.");
            return;
        }

        const datetimeValue = formData.get("datetime");
        if (!datetimeValue) {
            toast.error("Дата и время обязательны");
            return;
        }
        const incident_time = new Date(datetimeValue.toString());
        if (incident_time > new Date()) {
            toast.error("Дата и время не должны превышать текущее");
            return;
        }
        if (dangerLevel == null) {
            toast.error("Необходимо ввести уровень критичности")
            return;
        }

        const payload = {
            incident_time: incident_time,
            description: formData.get("description"),
            status_id: selectedStatus,
            type_incident_id: selectedIncidentType,
            sector: selectedZone,
            critical_level_id: dangerLevel
        };

        try {
            await createIncident(payload);
        } catch (e: any) {
            toast.error(e.message);
            return;
        }

        toast("Инцидент успешно создан");
    };


    return (
        <div className="container-fluid arena-container">
            <div className="row h-100">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header fs-5">Добавить Инцидент</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Дата и время</label>
                                    <input type="datetime-local" className="form-control" name="datetime" max={maxDateTime} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Описание</label>
                                    <textarea className="form-control" name="description" rows={3}></textarea>
                                </div>
                                {statuses && <Selector data={statuses} label="Статус" setSelectedElement={setSelectedStatus} selectedValue={selectedStatus}></Selector>}
                                {types && <Selector data={types} label="Тип инцидента" setSelectedElement={setSelectedIncidentType} selectedValue={selectedIncidentType}></Selector>}
                                <div className="mb-3">
                                    <label className="form-label">Сектор</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="sector"
                                        id="sectorInput"
                                        readOnly
                                        value={selectedZone || ""}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Уровень опасности</label>
                                    <CriticalLevel dangerLevel={dangerLevel} setDangerLevel={setDangerLevel} />
                                    <input type="hidden" name="danger" id="dangerValue" />
                                </div>
                                <button type="submit" className="btn btn-primary mt-2">Сохранить</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8 h-100">
                    <svg viewBox="0 0 400 300" className="arena-svg">
                        <defs>
                            <path id="sector-A1" d="M180,190 A85.6 60 0 0 1 220,190 L140,110 A85.6 60 0 0 1 260,110 Z" fill="#FFD1DC" className="zone-sector" />
                            <path id="sector-B1" d="M220,150 L260,110 A85.6 60 0 0 1 260,190 Z" fill="#E0F7FA" className="zone-sector" />
                            <path id="sector-C1" d="M220,120 A85.6 60 0 0 1 220,150 L260,190 A85.6 60 0 0 1 140,190 Z" fill="#C8E6C9" className="zone-sector" />
                            <path id="sector-D1" d="M180,150 L140,190 A85.6 60 0 0 1 140,110 Z" fill="#FFF9C4" className="zone-sector" />

                            <path id="sector-A2" d="M140,110 A85.6 60 0 0 1 260,110 L280,90 A120 80 0 0 0 120,90 Z" fill="#FFADB2" className="zone-sector" />
                            <path id="sector-B2" d="M260,110 A85.6 60 0 0 1 260,190 L280,210 A120 80 0 0 0 280,90 Z" fill="#B2EBF2" className="zone-sector" />
                            <path id="sector-C2" d="M260,190 A85.6 60 0 0 1 140,190 L120,210 A120 80 0 0 0 280,210 Z" fill="#A5D6A7" className="zone-sector" />
                            <path id="sector-D2" d="M140,190 A85.6 60 0 0 1 140,110 L120,90 A120 80 0 0 0 120,210 Z" fill="#FFECB3" className="zone-sector" />
                        </defs>

                        {["A1", "B1", "C1", "D1", "A2", "B2", "C2", "D2"].map(zone => (
                            <use
                                key={zone}
                                href={`#sector-${zone}`}
                                data-zone={zone}
                                onClick={() => setSelectedZone(zone)}
                                style={{ cursor: "pointer" }}
                            />
                        ))}

                        <line x1="243" y1="128" x2="280" y2="90" stroke="#666" strokeWidth="1" />
                        <line x1="243" y1="173" x2="280" y2="210" stroke="#666" strokeWidth="1" />
                        <line x1="158" y1="173" x2="120" y2="210" stroke="#666" strokeWidth="1" />
                        <line x1="158" y1="128" x2="120" y2="90" stroke="#666" strokeWidth="1" />

                        <ellipse cx="200" cy="150" rx="60" ry="40" fill="#fff" stroke="#999" strokeWidth="1" />

                        <text x="195" y="105" className="zone-label">A1</text>
                        <text x="265" y="150" className="zone-label">B1</text>
                        <text x="195" y="205" className="zone-label">C1</text>
                        <text x="120" y="150" className="zone-label">D1</text>
                        <text x="195" y="85" className="zone-label">A2</text>
                        <text x="290" y="150" className="zone-label">B2</text>
                        <text x="195" y="225" className="zone-label">C2</text>
                        <text x="95" y="150" className="zone-label">D2</text>
                    </svg>
                </div>
            </div >
        </div >
    );
};
