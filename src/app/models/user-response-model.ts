export interface UserResponse {
    id: number;
    name: string;
    title: string;
    role: string;
    mail: string;
    password: string;
    phone: string;
    salaryGross: number;
    level: string;
    salaryNet: number;
    manager: Manager;
    department: Department;
  }
  interface Manager {
    id: number;
    name: string;
    title: string;
    role: string;
    mail: string;
    password: string;
    phone: string;
    salaryGross: number;
    level: string;
    salaryNet: number;
    manager: Manager | null; // Recursive type, a manager can have their own manager
    department: Department;
  }
  interface Department {
    id: number;
    name: string;
    company: Company;
  }
  interface Company {
    id: number;
    name: string;
    location: string;
    description: string;
  }