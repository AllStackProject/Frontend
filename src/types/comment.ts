export interface MyComment {
  id: number;
  text: string;
  created_at: string;
  video_id: number;
  video_name: string;
  video_img: string;
}

export interface Comment {
  id: number;
  video_id: number;
  video_name: string;
  video_img: string;
  text: string;
  created_at: string;
}