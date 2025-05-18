export interface Status {
    id: number;
    name: string;
}

export interface Type {
    id: number;
    name: string;
}

export interface Sector {
    id: number;
    name: string;
}

export interface IncidentListItem {
    id: number;
    created_at: string;
    incident_time: string;
    description: string;
    sector: string;
    status: string;
}

export interface Incident extends IncidentListItem {
    securityman_name: string;
    securityman_surname: string;
    securityman_lastname: string;
    securityman_id: number;
    critical_level: string;
    type: string;
}

export interface UserInfo {
    id: number;
    name: string;
    surname: string;
    lastname: string;
    phone: string;
}