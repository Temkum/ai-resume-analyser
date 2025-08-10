import { useEffect, useRef, useState } from 'react';

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Determine gradient colors based on score
  let startColor = '#A7F3D0'; // default light green
  let endColor = '#059669'; // default dark green

  if (score < 45) {
    startColor = '#ef4444'; // red
    endColor = '#facc15'; // yellow-green
  } else if (score >= 45 && score < 70) {
    startColor = '#bbf7d0'; // light green
    endColor = '#86efac'; // softer green
  } else {
    startColor = '#A7F3D0'; // light green
    endColor = '#059669'; // dark green
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-xl font-semibold pt-4">{score}/100</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
