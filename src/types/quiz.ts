export interface QuizItem {
  id: number;
  question: string;
  description: string;
  is_correct: boolean;
  answer: boolean;
}

export interface QuizGroup {
  video_name: string;
  quiz: QuizItem[];
}