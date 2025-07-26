import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import type { Route } from '../+types/root';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Auth Page' },
    {
      name: 'description',
      content: 'Authentication page for the application.',
    },
  ];
}

const Auth = () => {
  const { isLoading, auth, init } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse the 'next' parameter more safely
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get('next') || '/home';

  useEffect(() => {
    // Initialize Puter if not already done
    init();
  }, [init]);

  useEffect(() => {
    // Only navigate if we're authenticated and not loading
    if (auth.isAuthenticated && !isLoading) {
      navigate(next);
    }
  }, [auth.isAuthenticated, isLoading, navigate, next]);

  const handleSignIn = async () => {
    try {
      await auth.signIn();
      // Navigation will happen automatically via the useEffect above
    } catch (error) {
      console.error('Sign in failed:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-log">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to Resumaid
            </h1>
            <p className="text-gray-600">
              {auth.isAuthenticated
                ? 'You are already logged in'
                : 'Please log in to continue'}
            </p>
          </div>

          <div>
            {isLoading ? (
              <button
                className="auth-button animate-pulse"
                disabled
                aria-busy="true"
              >
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="auth-button"
                    onClick={handleSignOut}
                    aria-label="Log out of your account"
                  >
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button
                    className="auth-button"
                    onClick={handleSignIn}
                    aria-label="Sign in to your account"
                  >
                    <p>Sign In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
