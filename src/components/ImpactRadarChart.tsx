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
import { CHART_COLORS } from "@/lib/chart-colors";

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

function isNegativeAverage(scores: DimensionalScores): boolean {
  const values = Object.values(scores) as number[];
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return avg < 0;
}

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
    <div className="h-64 sm:h-72 lg:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={CHART_COLORS.grid} />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: CHART_COLORS.axisText, fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[-10, 10]}
            tick={{ fill: CHART_COLORS.axisNumbers, fontSize: 10 }}
            tickCount={5}
          />
          {series.map((s) => {
            const fillColor = isNegativeAverage(s.scores) ? CHART_COLORS.negativeFill : s.color;
            return (
              <Radar
                key={s.label}
                name={s.label}
                dataKey={s.label}
                stroke={fillColor}
                fill={fillColor}
                fillOpacity={0.2}
              />
            );
          })}
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: "8px",
              color: CHART_COLORS.tooltipText,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
