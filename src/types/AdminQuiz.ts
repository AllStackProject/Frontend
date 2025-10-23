export interface Quiz {
  id: number;
  question: string;
  answer: "O" | "X";
}

export interface VideoQuiz {
  id: number;
  title: string;
  uploader: string;
  uploadDate: string;
  expireAt?: string;
  visibility: "organization" | "group" | "private";
  hasAIQuiz: boolean;
  quizzes: Quiz[];
}