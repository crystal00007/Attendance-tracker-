import React, { useMemo } from 'react';
import { AttendanceRecord, ClassEntry, AttendanceStatus } from '../types';

interface SemesterViewProps {
  classes: ClassEntry[];
  attendance: AttendanceRecord[];
}

const SemesterView: React.FC<SemesterViewProps> = ({ classes, attendance }) => {
  const statsByMonth = useMemo(() => {
    const stats: Record<string, { present: number; absent: number; special: number; total: number }> = {};
    
    attendance.forEach(record => {
      const month = new Date(record.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!stats[month]) {
        stats[month] = { present: 0, absent: 0, special: 0, total: 0 };
      }
      stats[month].total++;
      if (record.status === AttendanceStatus.Present) stats[month].present++;
      else if (record.status === AttendanceStatus.Absent) stats[month].absent++;
      else if (record.status === AttendanceStatus.Special) stats[month].special++;
    });

    return Object.entries(stats).sort(([monthA], [monthB]) => new Date(monthA) > new Date(monthB) ? 1 : -1);

  }, [attendance]);

  if (statsByMonth.length === 0) {
    return (
       <div className="text-center py-10 px-6 bg-[#1C1C1E] rounded-lg">
        <h3 className="text-lg font-medium text-white">No Attendance Data Yet</h3>
        <p className="text-sm text-gray-400 mt-2">Mark attendance in the Week or Month view to see your stats here.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1E] p-4 sm:p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Semester Attendance Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsByMonth.map(([month, data]) => {
          const presentPercent = data.total > 0 ? (data.present / data.total) * 100 : 0;
          const absentPercent = data.total > 0 ? (data.absent / data.total) * 100 : 0;
          const specialPercent = data.total > 0 ? (data.special / data.total) * 100 : 0;
          
          return (
            <div key={month} className="bg-black p-4 rounded-lg">
              <h4 className="font-bold text-[#F472B6] text-lg mb-4">{month}</h4>
              <p className="text-sm text-gray-400 mb-4">Total Marked Classes: <span className="font-semibold text-white">{data.total}</span></p>
              
              <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium" style={{color: '#4ade80'}}>Present</span>
                        <span>{data.present} ({presentPercent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${presentPercent}%`, backgroundColor: '#4ade80' }}></div>
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium" style={{color: '#f87171'}}>Absent</span>
                        <span>{data.absent} ({absentPercent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${absentPercent}%`, backgroundColor: '#f87171' }}></div>
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium" style={{color: '#facc15'}}>Special</span>
                        <span>{data.special} ({specialPercent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${specialPercent}%`, backgroundColor: '#facc15' }}></div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemesterView;