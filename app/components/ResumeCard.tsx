import React from 'react';
import { Link } from 'react-router';
import ScoreCircle from './ScoreCircle';

const ResumeCard = ({
  resume: { id, resumePath, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`/resume/${resumePath}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2>{companyName}</h2>
          <h3>{jobTitle || 'Job Title'}</h3>
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="resume-card-body animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <picture>
            <img
              src={imagePath}
              alt={`${companyName} logo`}
              className="w-16 h-16 mb-2"
            />
          </picture>
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
