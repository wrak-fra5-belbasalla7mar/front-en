export interface AttendanceResponseDTO {
    userId: number;
    date: string;
    status: LocationStatus;
    history?: {
      date: string;
      status: LocationStatus;
    }[];
}
export type LocationStatus = 'Absent'|'Remote'|'OnSite';
