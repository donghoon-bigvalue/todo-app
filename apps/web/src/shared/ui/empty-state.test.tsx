// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("기본 빈 상태 문구를 렌더링한다", () => {
    render(<EmptyState />);

    expect(screen.getByText("아직 할 일이 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("오늘 해야 할 일을 하나 추가해보세요.")).toBeInTheDocument();
  });
});
