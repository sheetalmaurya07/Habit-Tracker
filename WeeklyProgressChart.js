import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function WeeklyProgressChart({ data }) {

  return (
    <div className="card" style={{marginTop:"18px"}}>
        <h2 className="muted">30-Days Activity</h2>
        <p className="muted">
          Completion rate over the last 30 days
        </p>

      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(255, 255, 255, 0.20)"
              }}
              formatter={(value) => [
                `${value}%`,
                "Completion Rate"
              ]}
            />

            <Bar
              dataKey="completionRate"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            >

              {data.map((entry, index) => (

                <Cell
                  key={entry.name}
                  fill={
                    index === data.length - 1
                      ? "#4f46e5"
                      : "#818cf8"
                  }
                />

              ))}

            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}