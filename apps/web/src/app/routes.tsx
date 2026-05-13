import { TodoPage } from "../pages/todo-page";
import { ShowcasePage } from "../pages/showcase-page";

export const routes = [
  {
    path: "/",
    element: <TodoPage />,
  },
  {
    path: "/showcase",
    element: <ShowcasePage />,
  },
];
