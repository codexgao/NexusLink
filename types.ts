export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: number;
  likes: number;
  dislikes: number;
  userVote: 'like' | 'dislike' | null;
}

export type CategoryColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';

export interface CategoryMeta {
  name: string;
  color: CategoryColor;
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';