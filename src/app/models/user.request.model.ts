export interface UserRequestModel {
        name: string;
        title: string;
        role: string;
        mail: string;
        password: string;
        phone: string;
        salaryGross: number;
        level: string;
        salaryNet: number;
        manager: MangerRequest;
        department: DepartmentRequest;
}
export interface MangerRequest{
    id:number;
}
export interface DepartmentRequest{
    id:number;
}