
export interface Lesson {
  id: number;
  title: string;
  youtubeVideoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  content?: string;
  duration?: string;
  isFreePreview: boolean;
  orderIndex: number;
  sectionId: number;
  durationFormatted?: string;
  youtubeEmbedUrl?: string;
}

export interface LessonRequest {
  title: string;
  content?: string;
  orderIndex?: number;
  isFreePreview?: boolean;
  videoUrl?: string; 
}