import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  color?: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 200, color = "#2563eb" }) => {
  const data = [{ name: 'score', value: score, fill: color }];

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">{score}</span>
        <span className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wide mt-1 transition-colors">{label}</span>
      </div>
    </div>
  );
};

export default ScoreGauge;