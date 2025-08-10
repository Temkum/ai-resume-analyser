import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ScoreCircle from './ScoreCircle';
import { usePuterStore } from '../lib/puter';
import { useNavigate } from 'react-router';
import { FileText } from 'lucide-react';

const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  const { auth, fs } = usePuterStore();
  const navigate = useNavigate();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [id, auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!auth.isAuthenticated) return;

      try {
        // If imagePath exists and it's not the same as the PDF path, try to load it
        if (imagePath && !imagePath.endsWith('.pdf')) {
          const blob = await fs.read(imagePath);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setThumbnailUrl(url);
            return;
          }
        }
        // If no image path or failed to load, set hasImage to false
        setHasImage(false);
      } catch (error) {
        console.error('Failed to load thumbnail:', error);
        setHasImage(false);
      }
    };

    loadThumbnail();

    // Cleanup
    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [auth.isAuthenticated, imagePath, fs]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold text-lg break-words">
            {companyName || 'Resume'}
          </h2>
          <h3 className="text-lg break-words text-gray-500">
            {jobTitle || 'Position'}
          </h3>
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore || 0} />
        </div>
      </div>

      <div className="resume-card-body animate-in fade-in duration-1000">
        <div className="w-full h-full flex items-center justify-center">
          {thumbnailUrl && hasImage ? (
            <img
              src={thumbnailUrl}
              alt={`${companyName} resume preview`}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FileText size={48} />
              <span className="text-sm mt-2">PDF Resume</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
