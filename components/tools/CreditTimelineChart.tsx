"use client";

import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {chartLine} from "@/lib/theme";

export function CreditTimelineChart({data}: {data: {month: number; projected: number}[]}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{left: 8, right: 8, top: 12, bottom: 8}}>
          <XAxis dataKey="month" tickFormatter={(value) => `${value}m`} />
          <YAxis domain={[0, 800]} />
          <Tooltip />
          <Line dataKey="projected" stroke={chartLine} strokeWidth={3} type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
