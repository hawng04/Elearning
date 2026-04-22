export interface Course {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    price: number;
    status: string;
    teacherId: number;
    categoryName: string;
  }