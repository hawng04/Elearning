import axiosClient from '@/lib/axiosClient';
import { Course } from '@/types/course';

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses');
    return response.data;
  },
  
  getCourseById: async (id: number): Promise<Course> => {
    const response = await axiosClient.get(`/courses/${id}`);
    return response.data;
  },
  
  // getCoursesByCategory: async (categoryId: number): Promise<Course[]> => {
  //   const response = await axiosClient.get(`/courses`, {
  //     params: { categoryId }
  //   });
  //   return response.data;
  // },

 
  // searchCourses: async (keyword: string): Promise<Course[]> => {
  //   const response = await axiosClient.get(`/courses/search`, {
  //     params: { keyword }
  //   });
  //   return response.data;
  // }
};