
export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export enum AttendanceStatus {
  Unmarked = "unmarked",
  Present = "present",
  Absent = "absent",
  Special = "special", // e.g., excused, late
}

export interface ClassEntry {
  id: string;
  courseName: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  color: string;
}

export interface AttendanceRecord {
  classId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
}
