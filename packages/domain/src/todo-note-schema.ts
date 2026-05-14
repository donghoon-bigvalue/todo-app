import { z } from "zod";

export const MAX_TODO_NOTE_LENGTH = 500;

export const todoNoteSchema = z
  .string()
  .nullish()
  .transform((note) => {
    const trimmedNote = note?.trim() ?? "";

    return trimmedNote.length > 0 ? trimmedNote : null;
  })
  .pipe(
    z
      .string()
      .max(MAX_TODO_NOTE_LENGTH, `메모는 ${MAX_TODO_NOTE_LENGTH}자 이내로 입력해 주세요.`)
      .nullable(),
  );
