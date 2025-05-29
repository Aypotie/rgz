import { useEffect, useState } from "react";
import {
    type Sector,
    type Incident,
    type IncidentListItem,
    type Status,
    type Type as IncidentType
} from "../models/models";
import {
    getIncident,
    deleteIncident,
    getIncidentsBySectorID,
    updateIncident
} from "../api/incident";
import { getSector, getStatus, getType } from "../api/other";
import { normolizeTime } from "../utils/utils";
import { toast } from "react-toastify";
import { Selector } from "../components/Selector";
import { Pagination } from "../components/Pagination";
import { CriticalLevel } from "../components/CriticalLevel";

const PAGE_SIZE = 5;

export const IncidentsBySector = () => {
    // основной список и фильтры
    const [incidents, setIncidents] = useState<IncidentListItem[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [detailedIncident, setDetailedIncident] = useState<Incident | null>(
        null
    );
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [selectedSector, setSelectedSector] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalIncidents, setTotalIncidents] = useState(0);

    // модалка
    const [showModal, setShowModal] = useState(false);
    const [modalIncident, setModalIncident] = useState<Incident | null>(null);

    // поля редактирования
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [types, setTypes] = useState<IncidentType[]>([]);
    const [maxDateTime, setMaxDateTime] = useState("");
    const [formDatetime, setFormDatetime] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formStatus, setFormStatus] = useState(0);
    const [formType, setFormType] = useState(0);
    const [formDanger, setFormDanger] = useState<number | null>(null);

    // загрузка справочников
    useEffect(() => {
        getSector().then(r => {
            setSectors(r.sector);
            if (r.sector.length) setSelectedSector(r.sector[0].id);
        });
        getStatus().then(r => {
            setStatuses(r.status);
        });
        getType().then(r => {
            setTypes(r.type);
        });
        // max для datetime-local
        const now = new Date();
        setMaxDateTime(now.toISOString().slice(0, 16));
    }, []);

    // загрузка инцидентов
    useEffect(() => {
        if (!selectedSector) return;
        getIncidentsBySectorID(selectedSector, currentPage, PAGE_SIZE)
            .then(r => {
                setIncidents(r.incidents);
                setTotalIncidents(r.total);
            })
            .catch(() => {
                toast.error("Ошибка при загрузке инцидентов");
                setIncidents([]);
            });
    }, [selectedSector, currentPage]);

    // показать свернутую деталь
    const handleToggle = async (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setDetailedIncident(null);
        } else {
            const detail = await getIncident(id);
            setExpandedId(id);
            setDetailedIncident(detail);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот инцидент?")) {
            return;
        }

        try {
            // Оптимистичное обновление UI
            setIncidents(prev => prev.filter(i => i.id !== id));
            setTotalIncidents(prev => prev - 1);

            if (expandedId === id) {
                setExpandedId(null);
                setDetailedIncident(null);
            }

            // Отправляем запрос на удаление
            const response = await deleteIncident(id);

            if (!response.ok) {
                throw new Error("Ошибка при удалении");
            }

            toast.success("Инцидент успешно удалён");

            // Проверяем, остались ли элементы на текущей странице
            const shouldGoToPrevPage = incidents.length === 1 && currentPage > 1;
            const newPage = shouldGoToPrevPage ? currentPage - 1 : currentPage;

            if (shouldGoToPrevPage) {
                setCurrentPage(newPage);
            } else {
                // Полная перезагрузка данных
                const refreshed = await getIncidentsBySectorID(
                    selectedSector,
                    newPage,
                    PAGE_SIZE
                );
                setIncidents(refreshed.incidents);
                setTotalIncidents(refreshed.total);
            }
        } catch (error) {
            // Восстанавливаем состояние при ошибке
            const refreshed = await getIncidentsBySectorID(
                selectedSector,
                currentPage,
                PAGE_SIZE
            );
            setIncidents(refreshed.incidents);
            setTotalIncidents(refreshed.total);

            toast.error("Ошибка при удалении инцидента");
            console.error("Delete error:", error);
        }
    };

    // открыть модалку и заполнить поля формы
    const handleUpdate = async (id: number) => {
        const detail = await getIncident(id);
        setModalIncident(detail);
        setFormDatetime(detail.incident_time.slice(0, 16));
        setFormDescription(detail.description);
        setFormStatus(statuses.find(s => s.name === detail.status)?.id ?? 0);
        setFormType(types.find(t => t.name === detail.type)?.id ?? 0);
        setFormDanger(detail.critical_level_id);
        setShowModal(true);
    };

    // отправить обновление
    const handleSave = async () => {
        if (!modalIncident) return;
        if (formDanger == null) {
            toast.error("Укажите уровень критичности");
            return;
        }
        try {
            await updateIncident(modalIncident.id, {
                incident_time: new Date(formDatetime).toISOString(),
                description: formDescription,
                status_id: formStatus,
                type_incident_id: formType,
                critical_level_id: formDanger
            });
            toast.success("Инцидент обновлён");
            setShowModal(false);
            // обновить текущий список
            const refreshed = await getIncidentsBySectorID(
                selectedSector,
                currentPage,
                PAGE_SIZE
            );
            setIncidents(refreshed.incidents);
            setTotalIncidents(refreshed.total);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Инциденты по секторам</h2>

            <Selector
                data={sectors}
                label="Сектор"
                selectedValue={selectedSector}
                setSelectedElement={setSelectedSector}
            />

            <ul className="list-group mb-4">
                {incidents.map(i => (
                    <li key={i.id} className="list-group-item">
                        <div
                            className="d-flex justify-content-between align-items-start"
                            onClick={() => handleToggle(i.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <div>
                                <strong>{normolizeTime(i.incident_time)}</strong>:
                                <span className="ms-2">{i.description}</span>
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleUpdate(i.id);
                                    }}
                                >
                                    Изменить
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(i.id);
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                        {expandedId === i.id && detailedIncident && (
                            <div className="mt-2 ms-2">
                                <div>Тип: {detailedIncident.type}</div>
                                <div>Статус: {detailedIncident.status}</div>
                                <div>Критичность: {detailedIncident.critical_level}</div>
                                <div>Охранник: {detailedIncident.securityman_name}</div>
                                <div>Создано: {normolizeTime(detailedIncident.created_at)}</div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <Pagination
                pageSize={PAGE_SIZE}
                total={totalIncidents}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            {/* Модалка редактирования */}
            {showModal && modalIncident && (
                <>
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Редактировать инцидент #{modalIncident.id}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Дата и время</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={formDatetime}
                                            max={maxDateTime}
                                            onChange={e => setFormDatetime(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Описание</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formDescription}
                                            onChange={e => setFormDescription(e.target.value)}
                                        />
                                    </div>
                                    <Selector
                                        data={statuses}
                                        label="Статус"
                                        selectedValue={formStatus}
                                        setSelectedElement={setFormStatus}
                                    />
                                    <Selector
                                        data={types}
                                        label="Тип инцидента"
                                        selectedValue={formType}
                                        setSelectedElement={setFormType}
                                    />
                                    <div className="mb-3">
                                        <label className="form-label">Уровень опасности</label>
                                        <CriticalLevel dangerLevel={formDanger} setDangerLevel={setFormDanger} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Закрыть
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                    >
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}
        </div>
    );
};
