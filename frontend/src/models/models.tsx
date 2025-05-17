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
    datetime: string;
    description: string;
    sector: string;
    status: string;
    type: string;
    danger: number;
}

export interface UserInfo {
    id: number;
    name: string;
    surname: string;
    lastname: string;
    phone: string;
}