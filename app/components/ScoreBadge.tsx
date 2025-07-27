import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const getBadgeProps = (score: number) => {
  if (score > 70) {
    return {
      color: "bg-badge-green text-green-600",
      label: "Strong",
    };
  } else if (score > 49) {
    return {
      color: "bg-badge-yellow text-yellow-600",
      label: "Good start",
    };
  } else {
    return {
      color: "bg-badge-red text-red-600",
      label: "Needs work",
    };
  }
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const { color, label } = getBadgeProps(score);
  return (
    <div className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;
