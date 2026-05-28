import React, { useState, useMemo } from 'react';
import { ClassEntry, AttendanceRecord, AttendanceStatus, DayOfWeek } from '../types';
import { getTextColorForBackground } from '../utils/colors';

interface MonthViewProps {
  classes: ClassEntry[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (classId: string, date: string) => void;
}

const getStatusEmoji = (status: AttendanceStatus) => {
    switch (status) {
        case AttendanceStatus.Present: return '✅';
        case AttendanceStatus.Absent: return '❌';
        case AttendanceStatus.Special: return '🟨';
        default: return '';
    }
}

const MonthView: React.FC<MonthViewProps> = ({ classes, attendance, onMarkAttendance }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { monthName, year, calendarGrid } = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = [];
        let dayCounter = 1;
        const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        for (let i = 0; i < 6; i++) { // 6 weeks for full display
            if (dayCounter > daysInMonth) break;
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth -1)) {
                    week.push(null);
                } else if (dayCounter > daysInMonth) {
                    week.push(null);
                } else {
                    const date = new Date(year, month, dayCounter);
                    const dateString = date.toISOString().split('T')[0];
                    const dayName = dayOrder[date.getDay()] as DayOfWeek;
                    const dayClasses = classes
                        .filter(c => c.day === dayName)
                        .sort((a,b) => a.startTime.localeCompare(b.startTime));
                    week.push({ day: dayCounter, dateString, classes: dayClasses });
                    dayCounter++;
                }
            }
            grid.push(week);
        }
        
        return {
            monthName: currentDate.toLocaleString('default', { month: 'long' }),
            year,
            calendarGrid: grid
        };
    }, [currentDate, classes]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    };

    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="bg-[#1C1C1E] p-4 sm:p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-[#2C2C2E] transition-colors">‹ Prev</button>
                <h3 className="text-lg font-bold text-white">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-[#2C2C2E] transition-colors">Next ›</button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {dayHeaders.map(day => <div key={day} className="text-center font-bold text-xs text-[#F472B6] pb-2">{day}</div>)}
                {calendarGrid.flat().map((cell, index) => (
                    <div key={index} className={`h-28 sm:h-32 bg-black rounded-md p-1.5 overflow-y-auto ${!cell ? 'opacity-50' : ''}`}>
                        {cell && (
                            <>
                                <p className="text-xs font-bold text-gray-300">{cell.day}</p>
                                <div className="space-y-1 mt-1">
                                    {cell.classes.map(c => {
                                        const record = attendance.find(a => a.classId === c.id && a.date === cell.dateString);
                                        const status = record ? record.status : AttendanceStatus.Unmarked;
                                        const textColor = getTextColorForBackground(c.color);
                                        return (
                                            <button
                                                key={c.id}
                                                onClick={() => onMarkAttendance(c.id, cell.dateString)}
                                                className="w-full text-left rounded p-1 text-[10px] leading-tight flex justify-between items-start"
                                                style={{ backgroundColor: c.color, color: textColor }}
                                                aria-label={`Mark attendance for ${c.courseName} on ${cell.dateString}`}
                                            >
                                                <span>{c.courseName}</span>
                                                <span className="text-lg leading-none">{getStatusEmoji(status)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthView;