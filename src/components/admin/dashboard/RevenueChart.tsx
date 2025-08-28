'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
    month: string;
    revenue: number;
}

export const RevenueChart = ({ data }: { data: RevenueData[] }) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Doanh thu']}
                    labelFormatter={(label) => `Tháng: ${label}`}
                />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
