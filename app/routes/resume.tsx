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

  const resume = kv.get(`resume:${id}`);
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, isLoading, navigate, id]);

  useEffect(() => {
    const loadResume = async () => {
      if (!auth.isAuthenticated) return;
      if (!resume) return;
      const data = await resume;
      if (!data) return;

      const parsedData = JSON.parse(data);

      const resumeBlob = await fs.read(parsedData.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const resumeUrl = URL.createObjectURL(resumeBlob);

      const feedbackBlob = await fs.read(parsedData.feedbackPath);
      if (!feedbackBlob) return;
      const feedbackUrl = URL.createObjectURL(feedbackBlob);

      const feedback = await fs.read(parsedData.feedbackPath);
      if (!feedback) return;
      const feedbackText = await feedback.text();
      const feedbackData = JSON.parse(feedbackText);

      const imageBlob = await fs.read(parsedData.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);

      setResumeUrl(resumeUrl);
      setFeedback(feedbackData);
      setImageUrl(imageUrl);

      console.log(imageUrl, resumeUrl, pdfUrl, feedbackUrl);
    };
    loadResume();
  }, [resume, auth.isAuthenticated, isLoading, id]);

  return (
    <main className="main-section">
      <nav className="resume-nav">
        <Link to="/" className="sticky top-0 flex justify-between">
          <StepBack />
          <span>Back to Home</span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col gap-4">
        <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-500 gradient-border max-sm:m-0 h-[560px] w-[350px] lg:w-[430px] xl:w-[490px] bg-white rounded-2xl p-4">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt="Resume"
                  className="w-full h-full object-contain rounded-2xl"
                  title="Resume"
                />
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img
                src="/assets/images/bouncing-circles.svg"
                alt="loading"
                className="w-20 h-20"
              />
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-3xl font-semibold text-center">Resume Review</h2>
          {feedback ? (
            <div className="animate-in fade-in duration-500 gradient-border max-sm:m-0 h-[560px] w-[350px] lg:w-[430px] xl:w-[490px] bg-white rounded-2xl p-4">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img
                src="/assets/images/bouncing-circles.svg"
                alt="loading"
                className="w-20 h-20"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
