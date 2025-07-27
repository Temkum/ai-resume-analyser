import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/home';
import Navbar from '../components/Navbar';
import { usePuterStore } from '../lib/puter';
interface Resume {
  id: string;
  imagePath: string;
  companyName: string;
  jobTitle: string;
  file: string;
  jobDescription?: string;
  feedback?: any;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resumaid' },
    { name: 'description', content: 'Smart feedback for your dream job!' },
  ];
}

export default function Home() {
  const { auth, kv, isLoading } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/home');
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  // Load resumes from Puter KV store
  useEffect(() => {
    const loadResumes = async () => {
      if (!auth.isAuthenticated) return;

      try {
        setLoadingResumes(true);
        // Get all resume keys
        const resumeKeys = await kv.list('resume-*', false);

        if (resumeKeys && resumeKeys.length > 0) {
          // Fetch all resume data
          const resumePromises = resumeKeys.map(
            async (key: string | KVItem) => {
              const data = await kv.get(
                typeof key === 'string' ? key : key.key
              );
              return data ? JSON.parse(data) : null;
            }
          );

          const resumeData = await Promise.all(resumePromises);
          const validResumes = resumeData.filter((r) => r !== null) as Resume[];
          setResumes(validResumes);
        }
      } catch (error) {
        console.error('Failed to load resumes:', error);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [auth.isAuthenticated, kv]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <main>
        <Navbar />
        <section className="main-section">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-14">
          <h1 className="text-3xl font-bold mb-4">Welcome to Resumaid</h1>
          <p className="text-lg mb-6 py-3">
            Smart feedback for your dream job! This is a tool to help you
            analyze and improve your resume using AI.
          </p>

          <button
            onClick={() => navigate('/upload')}
            className="primary-button"
          >
            Upload New Resume
          </button>
        </div>
      </section>

      {/* Resume reviews section */}
      <section className="resume-section p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Resume Reviews</h2>

        {loadingResumes ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No reviews yet. Upload your resume to get started!
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="primary-button"
            >
              Upload Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="resume-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {resume.imagePath && (
                  <div className="mb-4 h-32 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src={resume.imagePath}
                      alt={`Resume preview`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">
                  {resume.jobTitle || 'Untitled Position'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {resume.companyName || 'Unknown Company'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/results?id=${resume.id}`)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    View Analysis
                  </button>
                  {resume.file && (
                    <a
                      href={resume.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
