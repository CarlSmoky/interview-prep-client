import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate({ to: '/' });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md">
        <Authenticator
          signUpAttributes={['name']}
          loginMechanisms={['email']}
          formFields={{
            signUp: {
              name: {
                order: 1,
              },
              email: {
                order: 2,
              },
              password: {
                order: 3,
              },
              confirm_password: {
                order: 4,
              },
            },
          }}
          components={{
            SignIn: {
              Footer() {
                return (
                  <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-flex items-center gap-2 text-custom-secondary-dark hover:text-custom-secondary-dark/60 transition-colors px-4 pb-4 text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Home
                  </Link>
                );
              },
            },
            SignUp: {
              Footer() {
                return (
                  <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-flex items-center gap-2 text-custom-secondary-dark hover:text-custom-secondary-dark/60 transition-colors px-4 pb-4 text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Home
                  </Link>
                );
              },
            },
          }}
        />
      </div>
    </div>
  );
}