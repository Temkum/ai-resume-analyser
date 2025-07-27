import React from 'react';
import ScoreGuage from './ScoreGuage';
import ScoreBadge from './ScoreBadge';

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score >= 80
      ? 'text-green-500'
      : score >= 50
      ? 'text-yellow-500'
      : 'text-red-500';

  return (
    <div className="resume-summary flex flex-col gap-2">
      <div className="category">
        <div className="flex flex-row gap-2">
          <p className="text-lg font-semibold">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-lg font-semibold">
          <span className={textColor}>{score}/100</span>
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md animate-in fade-in duration-500">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold mb-3.5">Summary</h2>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Overall Score</h3>
            <p className="text-lg font-semibold">
              This score is calculated based on the ATS and Details sections.
            </p>
          </div>
        </div>
        <ScoreGuage score={feedback.overallScore} />
      </div>

      <Category title="ATS" score={feedback.ATS.score} />
      <Category title="Tone and Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
