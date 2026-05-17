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

  getMyTeachingCourses: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses/my-teaching-courses');
    return response.data;
  },

  createCourse: async (courseData: any) => {
    const response = await axiosClient.post('/courses', courseData);
    return response.data;
  },

  getCourseCurriculum: async (courseId: string | number) => {
    
    const response = await axiosClient.get(`/courses/${courseId}`); 
    return response.data;
  },

  createSection: async (sectionData: { title: string; courseId: number }) => {
    const response = await axiosClient.post('/sections', sectionData);
    return response.data;
  },

  createLesson: async (lessonData: { title: string; youtubeUrl: string; sectionId: number }) => {
    const response = await axiosClient.post('/lessons', lessonData);
    return response.data;
  },
};