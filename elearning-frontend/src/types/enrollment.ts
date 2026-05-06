import { Course } from './course'; // Import type Course của bạn vào

export interface Enrollment {
  id: number;
  enrollmentDate: string; 
  status: string;
  course: Course; 
}