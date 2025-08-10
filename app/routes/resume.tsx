import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import type { Route } from './+types/resume';
import { StepBack } from 'lucide-react';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resume' },
    {
      name: 'description',
      content: 'Detailed resume page for the application.',
    },
  ];
}

const Resume = () => {
  const { id } = useParams();
  const { kv, fs, auth, isLoading } = usePuterStore();

  const [pdfUrl, setPdfUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, isLoading, navigate, id]);

  // Load resume data from KV store once
  useEffect(() => {
    const loadResumeData = async () => {
      if (!auth.isAuthenticated || !id) return;

      try {
        setDataLoading(true);
        const key = `resume-${id}`;

        const data = await kv.get(key);

        if (!data) {
          console.error('No resume data found for id:', id);
          setDataLoading(false);
          return;
        }

        const parsedData = JSON.parse(data);
        setResumeData(parsedData);
        setDataLoading(false);
      } catch (error) {
        console.error('Error loading resume data:', error);
        setDataLoading(false);
      }
    };

    loadResumeData();
  }, [id, auth.isAuthenticated, kv]);

  // Process resume data when it's loaded
  useEffect(() => {
    const processResumeData = async () => {
      if (!resumeData || !auth.isAuthenticated) return;

      // Prevent re-processing if we already have the PDF URL
      if (pdfUrl) return;

      try {
        // Load the PDF resume - using 'file' property instead of 'resumePath'
        const pdfPath = resumeData.file || resumeData.resumePath;

        const resumeBlob = await fs.read(pdfPath);

        if (!resumeBlob) {
          console.error('Failed to read resume blob from path:', pdfPath);
          return;
        }

        // Create URL for PDF viewing
        const pdfBlobWithType = new Blob([resumeBlob], {
          type: 'application/pdf',
        });
        const pdfObjectUrl = URL.createObjectURL(pdfBlobWithType);
        setPdfUrl(pdfObjectUrl);

        // Check if feedback is stored directly in the data or in a separate file
        if (resumeData.feedback) {
          // Feedback is stored directly in the data
          setFeedback(resumeData.feedback);
        } else if (resumeData.feedbackPath) {
          // Feedback is in a separate file
          const feedbackBlob = await fs.read(resumeData.feedbackPath);

          if (!feedbackBlob) {
            console.error(
              'Failed to read feedback blob from path:',
              resumeData.feedbackPath
            );
            return;
          }

          const feedbackText = await feedbackBlob.text();
          const feedbackData = JSON.parse(feedbackText);
          setFeedback(feedbackData);
        } else {
          console.error('No feedback found in data');
        }
      } catch (error) {
        console.error('Error processing resume data:', error);
      }
    };

    processResumeData();
  }, [resumeData, auth.isAuthenticated, fs, pdfUrl]);

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <main className="main-section">
      <nav className="resume-nav">
        <Link to="/" className="sticky top-0 flex justify-between">
          <StepBack />
          <span>Back to Home</span>
        </Link>
      </nav>
      <div className="flex flex-col-reverse lg:flex-row w-full gap-4">
        {/* PDF Viewer Section */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center flex-1">
          {dataLoading || !pdfUrl ? (
            <div className="flex items-center justify-center">
              <img
                src="/images/bouncing-circles.svg"
                alt="loading"
                className="w-20 h-20"
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 gradient-border max-sm:m-0 h-[80vh] w-full max-w-[800px] bg-white rounded-2xl p-4">
              <iframe
                src={pdfUrl}
                title="Resume PDF"
                className="w-full h-full rounded-2xl"
                style={{ border: 'none' }}
              />
            </div>
          )}
        </section>

        {/* Resume Review Section */}
        <section className="feedback-section flex-1">
          <h2 className="text-3xl font-semibold text-center">Resume Review</h2>
          {dataLoading || !feedback ? (
            <div className="flex items-center justify-center">
              <img
                src="/images/bouncing-circles.svg"
                alt="loading"
                className="w-20 h-20"
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 gradient-border max-sm:m-0 h-[80vh] w-full max-w-[900px] bg-white rounded-2xl p-4 overflow-y-auto">
              <div className="mb-4">
                <Summary feedback={feedback} />
              </div>
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
