import axiosClient from '@/lib/axiosClient';
import { Category } from '@/types/category';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get('/categories');
    return response.data;
  },
};