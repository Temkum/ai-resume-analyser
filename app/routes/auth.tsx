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
const auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search ? location.search.split('=')[1] : '/home';
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next, { replace: true });
    if (!auth.isAuthenticated && !isLoading) {
      auth.signIn();
    }
  }, [auth.isAuthenticated, auth, isLoading, navigate, next]);

  return (
    <main className='bg-[url("/path/to/your/image.jpg")] bg-cover min-h-screen flex items-center justify-center'>
      <div className="gradient-border shadow-log">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to Resumaid
            </h1>
            <p className="text-gray-600">Please log in to continue</p>
          </div>

          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="auth-button"
                    onClick={() => auth.signOut()}
                  >
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={() => auth.signIn()}>
                    <p>Sign In</p>
                  </button>
                )}
                <p>{auth.user ? `Hello, ${auth.user}` : 'Please log in'}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default auth;
