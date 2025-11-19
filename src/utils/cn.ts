import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind 클래스 병합용 유틸리티
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}