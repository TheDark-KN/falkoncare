"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  name: string
  [key: string]: string | number | undefined
}

interface AnalyticsChartProps {
  title: string
  data: ChartData[]
  chartType?: "bar" | "line"
  dataKey: string
  dataKey2?: string
  color?: string
  color2?: string
}

export function AnalyticsChart({
  title,
  data,
  chartType = "bar",
  dataKey,
  dataKey2,
  color = "#0ea5e9",
  color2 = "#10b981",
}: AnalyticsChartProps) {
  const ChartComponent = chartType === "line" ? LineChart : BarChart

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            {dataKey2 && <Legend />}
            {chartType === "line" ? (
              <>
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} name={dataKey} />
                {dataKey2 && (
                  <Line type="monotone" dataKey={dataKey2} stroke={color2} strokeWidth={2} name={dataKey2} />
                )}
              </>
            ) : (
              <>
                <Bar dataKey={dataKey} fill={color} name={dataKey} />
                {dataKey2 && <Bar dataKey={dataKey2} fill={color2} name={dataKey2} />}
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
