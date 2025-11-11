export interface Session {
  id: string;
  courseName: string;
  duration: number;     // minutes
  date: string;         // ISO format
  notes?: string;
  completed: boolean;
}
