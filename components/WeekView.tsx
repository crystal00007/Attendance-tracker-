import React, { useState, useMemo } from 'react';
import { ClassEntry, AttendanceRecord, DayOfWeek, AttendanceStatus } from '../types';
import { getTextColorForBackground } from '../utils/colors';

interface WeekViewProps {
  classes: ClassEntry[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (classId: string, date: string) => void;
}

const getStatusEmoji = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.Present: return '✅';
    case AttendanceStatus.Absent: return '❌';
    case AttendanceStatus.Special: return '🟨';
    default: return '...';
  }
};

// -----------------------------
// SEMESTER CHECK HELPER
// -----------------------------
const isWithinSemester = (date: Date) => {
  const start = localStorage.getItem("semesterStart");
  const end = localStorage.getItem("semesterEnd");

  if (!start || !end) return true; // don't block if not set

  const checkDate = new Date(date).setHours(0, 0, 0, 0);
  const startDate = new Date(start).setHours(0, 0, 0, 0);
  const endDate = new Date(end).setHours(0, 0, 0, 0);

  return checkDate >= startDate && checkDate <= endDate;
};

const WeekView: React.FC<WeekViewProps> = ({ classes, attendance, onMarkAttendance }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { weekStart, weekEnd, weekDates } = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    start.setDate(diff);

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }

    return { weekStart: dates[0], weekEnd: dates[6], weekDates: dates };
  }, [currentDate]);

  const changeWeek = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + offset * 7);
      return newDate;
    });
  };

  const dayOrder = Object.values(DayOfWeek);

  // -----------------------------
// CHECK IF WEEK IS WITHIN SEMESTER
// -----------------------------
const weekIsActive = weekDates.some(d => isWithinSemester(d));

return (
  <>
    {!weekIsActive && (
      <div className="bg-[#1C1C1E] p-6 rounded-lg text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-2">
          Semester Not Active
        </h2>
        <p className="text-gray-400">
          This week is outside your selected semester dates.
        </p>
      </div>
    )}

    <div className="bg-[#1C1C1E] p-4 sm:p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeWeek(-1)}
          className="p-2 rounded-md hover:bg-[#2C2C2E] transition-colors"
        >
          ‹ Prev
        </button>

        <h3 className="text-lg font-bold text-white text-center">
          {weekStart.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}{' '}
          -{' '}
          {weekEnd.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </h3>

        <button
          onClick={() => changeWeek(1)}
          className="p-2 rounded-md hover:bg-[#2C2C2E] transition-colors"
        >
          Next ›
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const dayName = dayOrder[index];
          const dateString = date.toISOString().split('T')[0];
          const isDayActive = isWithinSemester(date);

          const dayClasses = classes
            .filter(c => c.day === dayName)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={dateString}
              className={`bg-black rounded-lg p-3 ${
                !isDayActive ? 'opacity-40' : ''
              }`}
            >
              <h4 className="font-bold text-center text-sm text-[#F472B6] mb-2">
                {dayName.substring(0, 3)}
              </h4>

              <p className="text-xs text-center text-gray-400 mb-3">
                {date.getDate()}
              </p>

              <div className="space-y-2">
                {dayClasses.length > 0 ? (
                  dayClasses.map(c => {
                    const record = attendance.find(
                      a => a.classId === c.id && a.date === dateString
                    );

                    const status = record
                      ? record.status
                      : AttendanceStatus.Unmarked;

                    const textColor = getTextColorForBackground(c.color);

                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (isDayActive) {
                            onMarkAttendance(c.id, dateString);
                          }
                        }}
                        disabled={!isDayActive}
                        className="w-full text-left p-2 rounded-md transition-all duration-200 shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        style={{
                          backgroundColor: c.color,
                          color: textColor
                        }}
                      >
                        <p className="font-bold text-xs">
                          {c.courseName}
                        </p>

                        <p className="text-xs opacity-80">
                          {c.startTime} - {c.endTime}
                        </p>

                        <p className="text-right text-lg">
                          {isDayActive
                            ? getStatusEmoji(status)
                            : '🔒'}
                        </p>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-center text-gray-600 pt-4">
                    No classes.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>
);
};

export default WeekView;
