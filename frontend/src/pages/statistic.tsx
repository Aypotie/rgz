import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { getSector, getType } from "../api/other";
import { getIncidentsBySectorID } from "../api/incident";
import { type Sector, type Type, type IncidentListItem } from "../models/models";

interface SectorStats {
    name: string;
    count: number;
}

const Statistic = () => {
    const [data, setData] = useState<SectorStats[]>([]);
    const [chartType, setChartType] = useState<"sector" | "type">("sector");

    useEffect(() => {
        const fetchBySectors = async () => {
            const sectorsResponse = await getSector();
            const sectors: Sector[] = sectorsResponse.sector;

            const stats: SectorStats[] = [];

            for (const sector of sectors) {
                const response = await getIncidentsBySectorID(sector.id, 1, 1000); // получаем до 1000
                stats.push({
                    name: sector.name,
                    count: response.total,
                });
            }

            setData(stats);
        };

        const fetchByTypes = async () => {
            const typesResponse = await getType();
            const types: Type[] = typesResponse.type;

            const sectorsResponse = await getSector();
            const sectors: Sector[] = sectorsResponse.sector;

            const typeCounts: { [key: string]: number } = {};

            for (const type of types) {
                typeCounts[type.name] = 0;
            }

            for (const sector of sectors) {
                const incidentsResponse = await getIncidentsBySectorID(sector.id, 1, 1000);
                const incidents: IncidentListItem[] = incidentsResponse.incidents;

                for (const incident of incidents) {
                    // @ts-ignore: type есть в Incident, не в IncidentListItem
                    const type = incident.type;
                    if (type && typeCounts[type] !== undefined) {
                        typeCounts[type]++;
                    }
                }
            }

            const stats: SectorStats[] = Object.entries(typeCounts).map(([name, count]) => ({
                name,
                count,
            }));

            setData(stats);
        };

        const fetchData = async () => {
            try {
                if (chartType === "sector") {
                    await fetchBySectors();
                } else {
                    await fetchByTypes();
                }
            } catch (e) {
                console.error("Ошибка при загрузке статистики", e);
            }
        };

        fetchData();
    }, [chartType]);

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Статистика инцидентов</h2>
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
