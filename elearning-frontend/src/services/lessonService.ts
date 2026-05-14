import axiosClient from '@/lib/axiosClient';
import { Lesson, LessonRequest } from '@/types/lesson'; 


export const lessonService = {
  getLessonById: async (lessonId: number): Promise<Lesson> => {
    const response = await axiosClient.get(`/lessons/${lessonId}`);
    return response.data;
  },

  createLesson: async (sectionId: number, data: LessonRequest) => {
    const response = await axiosClient.post(`/lessons/sections/${sectionId}`, data);
    return response.data;
  },

  markAsCompleted: async (courseId: number, lessonId: number) => {
    const response = await axiosClient.post(`/enrollments/courses/${courseId}/lessons/${lessonId}/complete`);
    return response.data;
  },

  getCompletedLessons: async (courseId: number) => {
    const response = await axiosClient.get(`/progress/courses/${courseId}/completed-lessons`);
    return response.data; 
  },
  
};