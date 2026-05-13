// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

afterEach(() => {
  cleanup();
});

describe("Checkbox", () => {
  it("label과 연결된 checkbox를 렌더링한다", () => {
    render(<Checkbox label="장보기 완료" />);

    expect(screen.getByRole("checkbox", { name: "장보기 완료" })).toBeInTheDocument();
  });

  it("checked 상태를 표현한다", () => {
    render(<Checkbox checked label="운동하기 완료" readOnly />);

    expect(screen.getByRole("checkbox", { name: "운동하기 완료" })).toBeChecked();
  });
});
