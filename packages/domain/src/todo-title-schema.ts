import { z } from "zod";

export const MAX_TODO_TITLE_LENGTH = 100;

export const todoTitleSchema = z
  .string()
  .transform((title) => title.trim().replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(1, "할 일을 입력해 주세요.")
      .max(MAX_TODO_TITLE_LENGTH, `할 일은 ${MAX_TODO_TITLE_LENGTH}자 이내로 입력해 주세요.`),
  );
