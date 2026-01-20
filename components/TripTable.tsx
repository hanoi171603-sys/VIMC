import React from 'react';
import { Trip, TripStatus, FilterType } from '../types';
import { isThisWeek, isThisMonth } from '../services/tripService';

interface TripTableProps {
  trips: Trip[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onUpdateStatus: (id: number, status: TripStatus) => void;
  onDelete: (id: number) => void;
}

const TripTable: React.FC<TripTableProps> = ({ trips, filter, setFilter, onUpdateStatus, onDelete }) => {
  
  const getFilteredTrips = () => {
    let filtered = [...trips].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    if (filter === 'week') return filtered.filter(t => isThisWeek(t.date));
    if (filter === 'month') return filtered.filter(t => isThisMonth(t.date));
    return filtered;
  };

  const filteredTrips = getFilteredTrips();

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case TripStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ duyệt
          </span>
        );
      case TripStatus.APPROVED:
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
             Đã duyệt
          </span>
        );
      case TripStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             Từ chối
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'week', label: 'Tuần này' },
    { id: 'month', label: 'Tháng này' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 bg-gray-50/50 p-2">
        <div className="flex space-x-1 p-1 bg-gray-200/50 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                filter === tab.id 
                  ? 'bg-white text-blue-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-400 font-medium italic px-4 py-2 sm:py-0">
          Hiển thị {filteredTrips.length} kết quả
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider w-[180px]">Thời gian</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider w-[220px]">Thông tin xe & Người đi</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Chi tiết Lộ trình</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-center w-[150px]">Trạng thái</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-right w-[140px]">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTrips.length === 0 ? (
               <tr>
                 <td colSpan={5} className="py-16 text-center text-gray-400">
                   <div className="flex flex-col items-center justify-center">
                     <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                     </svg>
                     <span className="font-medium">Chưa có dữ liệu đăng ký nào.</span>
                   </div>
                 </td>
               </tr>
            ) : (
              filteredTrips.map((trip) => (
                <tr key={trip.id} className="group hover:bg-blue-50/30 transition-colors duration-150">
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-lg shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-base">{formatDate(trip.date)}</div>
                        <div className="text-sm font-semibold text-blue-600 flex items-center gap-1 mt-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {trip.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-gray-900">{trip.name}</div>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/></svg>
                        {trip.carType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="space-y-2">
                       <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span className="font-semibold text-gray-800">{trip.destination}</span>
                       </div>
                       <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <p className="text-sm text-gray-600 line-clamp-2">{trip.purpose}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center align-top pt-8">
                    {getStatusBadge(trip.status)}
                  </td>
                  <td className="px-6 py-5 text-right align-top pt-6">
                    <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {trip.status === TripStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(trip.id, TripStatus.APPROVED)} 
                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition tooltip"
                            title="Duyệt"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(trip.id, TripStatus.REJECTED)} 
                            className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition tooltip"
                            title="Từ chối"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => onDelete(trip.id)} 
                        className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 hover:text-red-600 transition tooltip"
                        title="Xóa"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripTable;