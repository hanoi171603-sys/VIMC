import React from 'react';
import { Trip, TripStatus } from '../types';
import { isThisWeek, isThisMonth } from '../services/tripService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsCardsProps {
  trips: Trip[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ trips }) => {
  const monthCount = trips.filter(t => isThisMonth(t.date)).length;
  const weekCount = trips.filter(t => isThisWeek(t.date)).length;
  const approvedCount = trips.filter(t => t.status === TripStatus.APPROVED).length;
  const pendingCount = trips.filter(t => t.status === TripStatus.PENDING).length;

  const chartData = [
    { name: 'Đã duyệt', value: approvedCount, color: '#16a34a' },
    { name: 'Chờ duyệt', value: pendingCount, color: '#f97316' },
    { name: 'Từ chối', value: trips.filter(t => t.status === TripStatus.REJECTED).length, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-gray-400 flex flex-col justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Chuyến trong tháng</p>
                    <h3 className="text-3xl font-bold text-gray-800">{monthCount}</h3>
                </div>
                 <div className="mt-4 text-sm text-gray-500">Tổng số chuyến đi ghi nhận trong tháng này.</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex flex-col justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Trong tuần này</p>
                    <h3 className="text-3xl font-bold text-blue-600">{weekCount}</h3>
                </div>
                <div className="mt-4 text-sm text-gray-500">Số chuyến đi dự kiến hoặc đã thực hiện tuần này.</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 flex flex-col justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Đã duyệt</p>
                    <h3 className="text-3xl font-bold text-green-600">{approvedCount}</h3>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500 flex flex-col justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Đang chờ duyệt</p>
                    <h3 className="text-3xl font-bold text-orange-500">{pendingCount}</h3>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tổng quan trạng thái</h4>
            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default StatsCards;