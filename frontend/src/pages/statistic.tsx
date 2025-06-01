import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { getSector, getType } from "../api/other";
import { getIncidentsByDate } from "../api/incident";
import { type Sector, type Type, type IncidentListItem } from "../models/models";

interface SectorStats {
    name: string;
    count: number;
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const Statistic = () => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const [startDate, setStartDate] = useState<string>(formatDate(oneWeekAgo));
    const [endDate, setEndDate] = useState<string>(formatDate(today));

    const [data, setData] = useState<SectorStats[]>([]);
    const [chartType, setChartType] = useState<"sector" | "type">("sector");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sectorsResponse, typesResponse, incidentsResponse] = await Promise.all([
                    getSector(),
                    getType(),
                    getIncidentsByDate(startDate, endDate)
                ]);

                const sectors: Sector[] = sectorsResponse.sector;
                const types: Type[] = typesResponse.type;
                const incidents: IncidentListItem[] = incidentsResponse.incidents;

                if (chartType === "sector") {
                    const sectorMap: Record<string, number> = {};

                    for (const sector of sectors) {
                        sectorMap[sector.name] = 0;
                    }

                    for (const incident of incidents) {
                        const sector = sectors.find(s => s.name === incident.sector);
                        if (sector) {
                            sectorMap[sector.name]++;
                        }
                    }

                    const stats: SectorStats[] = Object.entries(sectorMap).map(([name, count]) => ({ name, count }));
                    setData(stats);
                } else {
                    const typeMap: Record<string, number> = {};

                    for (const type of types) {
                        typeMap[type.name] = 0;
                    }

                    for (const incident of incidents) {
                        if (incident.type && typeMap[incident.type] !== undefined) {
                            typeMap[incident.type]++;
                        }
                    }

                    const stats: SectorStats[] = Object.entries(typeMap).map(([name, count]) => ({ name, count }));
                    setData(stats);
                }
            } catch (e) {
                console.error("Ошибка при загрузке статистики", e);
            }
        };

        fetchData();
    }, [chartType, startDate, endDate]);

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Статистика инцидентов</h2>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">Дата начала</label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">Дата окончания</label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="chartType" className="form-label">Выберите график:</label>
                <select
                    id="chartType"
                    className="form-select"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as "sector" | "type")}
                >
                    <option value="sector">По секторам</option>
                    <option value="type">По типам</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#007bff" name="Количество инцидентов" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Statistic;
