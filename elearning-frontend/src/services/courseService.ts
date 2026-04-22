import axiosClient from '@/lib/axiosClient';
import { Course } from '@/types/course';

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses');
    return response.data;
  },
  
  
};