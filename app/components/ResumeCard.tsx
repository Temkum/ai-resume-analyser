import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ScoreCircle from './ScoreCircle';
import { usePuterStore } from '../lib/puter';
import { useNavigate } from 'react-router';

const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  const { auth, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [id, auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResume = async () => {
      if (!auth.isAuthenticated) return;

      try {
        const blob = await fs.read(imagePath);
        console.log(blob);
        if (!blob) return;

        let url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (error) {
        console.error('Failed to load resumes:', error);
      }
    };

    loadResume();
  }, [auth.isAuthenticated, imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold text-lg break-words">
            {companyName && companyName}
          </h2>
          <h3 className="text-lg break-words text-gray-500">
            {jobTitle && jobTitle}
          </h3>
          {!companyName && !jobTitle && (
            <h2 className="text-gray-500 font-bold">Resume</h2>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="resume-card-body animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt={`${companyName} logo`}
              className="w-16 h-16 mb-2"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
