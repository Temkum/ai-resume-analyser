import { resumes } from 'utilities/data';
import type { Route } from './+types/home';
import Navbar from '~/components/Navbar';
import { usePuterStore } from '~/lib/puter';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resumaid' },
    { name: 'description', content: 'Smart feedback for your dream job!' },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const location = useLocation();
  const next = location.search ? location.search.split('=')[1] : '/home';
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, next]);

  return (
    <main>
      <Navbar />
      <section className="main-section">
        <h1 className="text-3xl font-bold mb-4">Welcome to Resumaid</h1>
        <p className="text-lg mb-6 py-3">
          Smart feedback for your dream job! This is a tool to help you analyze
          and improve your resume using AI.
        </p>
      </section>

      {/* map over resume reviews generated */}
      <section className="resume-section">
        <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>

        <div className="reviews-list">
          {/* Placeholder for reviews, replace with actual data */}
          <p className="text-gray-500">No reviews yet. Upload your resume!</p>
        </div>

        {resumes &&
          resumes.map((resume: Resume) => (
            <div key={resume.id} className="resume-card">
              <img
                src={resume.imagePath}
                alt={`${resume.companyName} logo`}
                className="w-16 h-16 mb-2"
              />
              <h3 className="text-xl font-bold">
                {resume.jobTitle || 'Job Title'}
              </h3>
              <p className="text-gray-600">
                {resume.companyName || 'Company Name'}
              </p>
              <a
                href={resume.resumePath}
                className="text-blue-500 hover:underline"
              >
                View Resume
              </a>
            </div>
          ))}
      </section>
    </main>
  );
}
