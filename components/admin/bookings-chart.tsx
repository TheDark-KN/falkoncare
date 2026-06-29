"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BookingsChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

export function BookingsChart({ data }: BookingsChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis 
            dataKey="status" 
            stroke="currentColor" 
            className="text-xs text-slate-500 dark:text-slate-400"
          />
          <YAxis 
            stroke="currentColor" 
            className="text-xs text-slate-500 dark:text-slate-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              color: "#0f172a",
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="Bookings"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
