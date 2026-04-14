import * as Sentry from "@sentry/react";
import { Authenticator } from '@aws-amplify/ui-react';
import { RouterProvider } from '@tanstack/react-router'
import { router } from "./router";

const App = () => {
  return (
    <Authenticator.Provider>
      <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
        <RouterProvider router={router} />
      </Sentry.ErrorBoundary>
    </Authenticator.Provider>
  );
};

export default App
