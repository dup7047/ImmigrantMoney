"use client";

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {chartPalette} from "@/lib/theme";

export function BudgetPieChart({data}: {data: {name: string; value: number}[]}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={54} outerRadius={98} paddingAngle={2}>
            {data.map((item, index) => (
              <Cell fill={chartPalette[index % chartPalette.length]} key={item.name} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${Number(value).toFixed(0)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
