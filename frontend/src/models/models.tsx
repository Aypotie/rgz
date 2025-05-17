export interface Status {
    id: number;
    name: string;
}

export interface Type {
    id: number;
    name: string;
}

export interface Incident {
    id: number;
    created_at: string;
    incident_time: string;
    description: string;
    sector: string;
    status: string;
}

export interface UserInfo {
    id: number;
    name: string;
    surname: string;
    lastname: string;
    phone: string;
}