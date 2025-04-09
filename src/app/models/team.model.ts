import { TeamMember } from "./team-member.model";

export interface Team {
    id: number;
    teamName: string;
    managerId: number;
    members: TeamMember[];
  }
  