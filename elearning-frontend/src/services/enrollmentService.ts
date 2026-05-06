import axiosClient from '@/lib/axiosClient';
import { Enrollment } from '@/types/enrollment'; 

export const enrollmentService = {
  enrollCourse: async (courseId: number, paymentData: any): Promise<Enrollment> => {
    const response = await axiosClient.post<Enrollment>(`/enrollments/${courseId}`, paymentData);
    return response.data;
  },


  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await axiosClient.get<Enrollment[]>('/enrollments/my-courses');
    return response.data;
  }
};