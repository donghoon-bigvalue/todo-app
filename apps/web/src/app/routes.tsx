import { AuthGate } from "../pages/auth-gate";
import { ShowcasePage } from "../pages/showcase-page";

export const routes = [
  {
    path: "/",
    element: <AuthGate />,
  },
  {
    path: "/showcase",
    element: <ShowcasePage />,
  },
];
