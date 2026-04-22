import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { redirect } from "@tanstack/react-router";

export const requireAuth = async () => {
  try {
    const session = await fetchAuthSession();
    if (!session.tokens) {
      throw new Error("Not authenticated");
    }
  } catch {
    throw redirect({ to: "/login", search: { redirect: "/interview" } });
  }
};

export const configureAuth = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        signUpVerificationMethod: "code",
        loginWith: {
          email: true,
        },
      },
    },
  });
};
