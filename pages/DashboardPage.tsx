import React, { useState, useMemo } from 'react';
import { ClassEntry, AttendanceRecord, AttendanceStatus } from '../types';
import ViewToggle from '../components/ViewToggle';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import SemesterView from '../components/SemesterView';
import Dashboard from '../components/Dashboard';
import StatsBar from '../components/StatsBar';

interface DashboardPageProps {
    classes: ClassEntry[];
    attendance: AttendanceRecord[];
    onMarkAttendance: (classId: string, date: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ classes, attendance, onMarkAttendance }) => {
    const [view, setView] = useState<'week' | 'month' | 'semester'>('week');
    
    const { totalAttended, totalMissed } = useMemo(() => {
        return attendance.reduce(
            (acc, record) => {
                if (record.status === AttendanceStatus.Present) acc.totalAttended++;
                if (record.status === AttendanceStatus.Absent) acc.totalMissed++;
                return acc;
            },
            { totalAttended: 0, totalMissed: 0 }
        );
    }, [attendance]);

    return (
        <div className="pb-24"> {/* Padding for the fixed StatsBar */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-12">
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Attendance View</h2>
                        <div className="max-w-md mx-auto mb-6">
                            <ViewToggle currentView={view} onViewChange={setView} />
                        </div>
                        {view === 'week' && <WeekView classes={classes} attendance={attendance} onMarkAttendance={onMarkAttendance} />}
                        {view === 'month' && <MonthView classes={classes} attendance={attendance} onMarkAttendance={onMarkAttendance} />}
                        {view === 'semester' && <SemesterView classes={classes} attendance={attendance} />}
                    </div>
                </div>

                {/* Dashboard Column */}
                <div className="lg:col-span-1 mt-12 lg:mt-0">
                    <Dashboard classes={classes} attendance={attendance} />
                </div>
            </div>
            <StatsBar totalAttended={totalAttended} totalMissed={totalMissed} />
        </div>
    );
};

export default DashboardPage;
