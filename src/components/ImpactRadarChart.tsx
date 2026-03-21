import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DimensionalScores } from "@/lib/atis-calculator";

interface RadarDataEntry {
  dimension: string;
  fullMark: number;
  [key: string]: string | number;
}

interface RadarSeries {
  label: string;
  scores: DimensionalScores;
  color: string;
}

interface ImpactRadarChartProps {
  series: RadarSeries[];
}

const DIMENSIONS = [
  { key: "scientific", label: "Scientific" },
  { key: "economic", label: "Economic" },
  { key: "human_rights", label: "Human Rights" },
  { key: "health", label: "Health" },
  { key: "cultural", label: "Cultural" },
];

export function ImpactRadarChart({ series }: ImpactRadarChartProps) {
  const data: RadarDataEntry[] = DIMENSIONS.map((dim) => {
    const entry: RadarDataEntry = {
      dimension: dim.label,
      fullMark: 10,
    };
    for (const s of series) {
      entry[s.label] = s.scores[dim.key as keyof DimensionalScores];
    }
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#2a2a3a" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[-10, 10]}
          tick={{ fill: "#6b7280", fontSize: 10 }}
          tickCount={5}
        />
        {series.map((s) => (
          <Radar
            key={s.label}
            name={s.label}
            dataKey={s.label}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.2}
          />
        ))}
        <Tooltip
          contentStyle={{
            backgroundColor: "#13131a",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            color: "#e2e8f0",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
