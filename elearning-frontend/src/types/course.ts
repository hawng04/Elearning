import { Section } from "./section";

export interface Course {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    price: number;
    status: string;
    teacherId: number;
    categoryName: string;
    sections?: Section[];

    rating?: number;
    totalRatings?: number;
    totalStudents?: number;
    language?: string;
    lastUpdated?: string;
    benefits?: string[];
    requirements?: string[];
    includes?: string[];
  }