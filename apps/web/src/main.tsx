import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./app/query-client";
import { routes } from "./app/routes";
import "./styles.css";

const root = document.getElementById("root");
const queryClient = createQueryClient();

if (!root) {
  throw new Error("Root element를 찾을 수 없습니다.");
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </QueryClientProvider>
  </StrictMode>,
);
