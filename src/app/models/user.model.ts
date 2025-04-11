import { Manager } from "./user-response-model";

export interface UserModel {
    id?: number;
    name?: string;
    title?: string;
    role?: string;
    location?: string;
    grossSalary?: number|undefined;
    manager?: Manager;
    department?: string;
    email?: string;
}
