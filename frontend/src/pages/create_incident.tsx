import { useEffect, useState } from "react";
import type { Status, Type } from "../models/models";
import { getStatus, getType } from "../api/status";
import { createIncident } from "../api/incident";
import { toast } from 'react-toastify';


export const CreateIncident = () => {
    const [statuses, setStatuses] = useState<Array<Status> | null>(null);
    const [types, setTypes] = useState<Array<Type> | null>(null);
    const [dangerLevel, setDangerLevel] = useState<number | null>(null);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await getStatus();
                setStatuses(response.status);
            } catch (e) {
                console.error("Failed to load statuses", e);
            }
        };
        const fetchTypes = async () => {
            try {
                const response = await getType();
                setTypes(response.type);
            } catch (e) {
                console.error("Failed to load types", e);
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

        const payload = {
            incident_time: formData.get("datetime"),
            description: formData.get("description"),
            status_id: Number(formData.get("status")),
            type_incident_id: Number(formData.get("type")),
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
                                    <input type="datetime-local" className="form-control" name="datetime" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Описание</label>
                                    <textarea className="form-control" name="description" rows={3}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Статус</label>
                                    <select className="form-select" name="status">
                                        {statuses && statuses.map(status => (
                                            <option key={status.id} value={status.id}>{status.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Тип инцидента</label>
                                    <select className="form-select" name="type">
                                        {types && types.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
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
                                    <div className="d-flex justify-content-between">
                                        {[1, 2, 3, 4, 5].map(level => {
                                            const bgColor =
                                                level === 1 ? 'bg-success' :
                                                    level === 2 ? 'bg-level-2' :
                                                        level === 3 ? 'bg-warning' :
                                                            level === 4 ? 'bg-level-4' :
                                                                'bg-danger';

                                            return (
                                                <div
                                                    key={level}
                                                    className={`danger-box ${bgColor} ${dangerLevel === level ? 'border border-dark' : ''}`}
                                                    data-level={level}
                                                    onClick={() => setDangerLevel(level)}
                                                    style={{
                                                        width: '18%',
                                                        height: '20px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
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
