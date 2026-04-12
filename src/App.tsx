import * as Sentry from "@sentry/react";
import { RouterProvider } from '@tanstack/react-router'
import { router } from "./router";

const App = () => {
  return (
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <RouterProvider router={router} />
    </Sentry.ErrorBoundary>
  );
};

export default App
