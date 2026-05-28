import React, { useMemo, useState } from 'react';
import { ClassEntry, AttendanceRecord, AttendanceStatus } from '../types';
import { ChartBarIcon } from './Icons';

interface DashboardProps {
  classes: ClassEntry[];
  attendance: AttendanceRecord[];
}

interface SubjectStats {
  present: number;
  absent: number;
  total: number;
  color: string;
}

const TARGET_PERCENTAGE = 75;

const getPercentageColor = (percentage: number): string => {
  if (percentage >= 85) return '#4ade80';
  if (percentage >= 60) return '#facc15';
  return '#f87171';
};

// How many consecutive PRESENT classes are needed to reach target
const calculateTargetNeeded = (
  present: number,
  total: number,
  target: number
) => {
  if (total === 0) return 0;

  let needed = 0;
  let p = present;
  let t = total;

  const targetRatio = target / 100;

  while (p / t < targetRatio) {
    needed++;
    p++;
    t++;
  }

  return needed;
};

const Dashboard: React.FC<DashboardProps> = ({ classes, attendance }) => {
  // -----------------------------
  // SEMESTER SETTINGS STATE
  // -----------------------------
  const [semesterStart, setSemesterStart] = useState(
    localStorage.getItem('semesterStart') || ''
  );
  const [semesterEnd, setSemesterEnd] = useState(
    localStorage.getItem('semesterEnd') || ''
  );

  const saveSemesterDates = () => {
  if (!semesterStart || !semesterEnd) {
    alert('Please select both semester dates');
    return;
  }

  if (semesterStart > semesterEnd) {
    alert('End date cannot be before start date');
    return;
  }

  localStorage.setItem('semesterStart', semesterStart);
  localStorage.setItem('semesterEnd', semesterEnd);

  alert('Semester dates saved!');
};

  // -----------------------------
  // DASHBOARD STATS
  // -----------------------------
  const {
    overallPercentage,
    totalMarked,
    subjectStats,
    totalPresent,
    targetNeeded
  } = useMemo(() => {
    const stats: Record<string, SubjectStats> = {};

    classes.forEach(c => {
      stats[c.courseName] = {
        present: 0,
        absent: 0,
        total: 0,
        color: c.color
      };
    });

    attendance.forEach(record => {
      const classInfo = classes.find(c => c.id === record.classId);
      if (classInfo) {
        const subject = stats[classInfo.courseName];
        if (record.status === AttendanceStatus.Present) {
          subject.present++;
          subject.total++;
        } else if (record.status === AttendanceStatus.Absent) {
          subject.absent++;
          subject.total++;
        }
      }
    });

    const totalPresent = Object.values(stats).reduce(
      (sum, s) => sum + s.present,
      0
    );
    const totalMarked = Object.values(stats).reduce(
      (sum, s) => sum + s.total,
      0
    );

    const overallPercentage =
      totalMarked > 0 ? (totalPresent / totalMarked) * 100 : 0;

    const targetNeeded = calculateTargetNeeded(
      totalPresent,
      totalMarked,
      TARGET_PERCENTAGE
    );

    return {
      overallPercentage,
      totalMarked,
      subjectStats: Object.entries(stats).filter(
        ([, data]) => data.total > 0
      ),
      totalPresent,
      targetNeeded
    };
  }, [classes, attendance]);

  // -----------------------------
  // SEMESTER SETTINGS UI BLOCK
  // -----------------------------
  const SemesterSettings = () => (
    <div className="bg-[#111] p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-3">
        Semester Settings
      </h3>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-400">Start Date</label>
        <input
          type="date"
          value={semesterStart}
          onChange={(e) => setSemesterStart(e.target.value)}
          min="2024-01-01"
max="2035-12-31"
          className="bg-black border border-gray-700 rounded px-3 py-2 text-white"
        />

        <label className="text-sm text-gray-400">End Date</label>
        <input
          type="date"
          value={semesterEnd}
          onChange={(e) => setSemesterEnd(e.target.value)}
          min="2024-01-01"
max="2035-12-31"
          className="bg-black border border-gray-700 rounded px-3 py-2 text-white"
        />

        <button
          onClick={saveSemesterDates}
          className="mt-2 bg-pink-500 hover:bg-pink-600 transition rounded px-4 py-2 text-black font-semibold"
        >
          Save Semester Dates
        </button>
      </div>
    </div>
  );

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (totalMarked === 0) {
    return (
      <div className="bg-[#1C1C1E] p-6 rounded-lg space-y-6">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="h-6 w-6 text-[#F472B6]" />
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        </div>

        <SemesterSettings />

        <p className="text-sm text-gray-400">
          Mark attendance in the views below to see your stats here.
        </p>
      </div>
    );
  }

  // -----------------------------
  // NORMAL DASHBOARD VIEW
  // -----------------------------
  return (
    <div className="bg-[#1C1C1E] p-6 rounded-lg sticky top-8 space-y-6">
      <div className="flex items-center gap-3">
        <ChartBarIcon className="h-6 w-6 text-[#F472B6]" />
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      </div>

      <SemesterSettings />

      {/* OVERALL STATS */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Overall Attendance
        </h3>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="3"
              />
              <path
                className="transition-all duration-500"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getPercentageColor(overallPercentage)}
                strokeWidth="3"
                strokeDasharray={`${overallPercentage}, 100`}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {overallPercentage.toFixed(0)}%
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 flex-1">
            You've attended {totalPresent} out of {totalMarked} marked classes.
          </p>
        </div>
      </div>

      {/* TARGET MODE */}
      <div className="bg-[#111] p-4 rounded-lg border border-pink-500/30">
        <h3 className="text-lg font-semibold text-white mb-2">
          🎯 Target Mode ({TARGET_PERCENTAGE}%)
        </h3>

        {overallPercentage >= TARGET_PERCENTAGE ? (
          <p className="text-green-400 font-medium">
            ✅ You've met your attendance target. Keep it up!
          </p>
        ) : (
          <p className="text-gray-300">
            You need to attend{' '}
            <span className="text-pink-400 font-bold">
              {targetNeeded}
            </span>{' '}
            more class{targetNeeded === 1 ? '' : 'es'} in a row to
            reach {TARGET_PERCENTAGE}%.
          </p>
        )}
      </div>

      {/* PER SUBJECT STATS */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          By Subject
        </h3>

        <div className="space-y-4">
          {subjectStats.map(([courseName, data]) => {
            const percentage = (data.present / data.total) * 100;

            return (
              <div key={courseName}>
                <div className="flex justify-between text-sm mb-1">
                  <span
                    className="font-medium text-white truncate pr-2"
                    style={{
                      borderLeft: `3px solid ${data.color}`,
                      paddingLeft: '8px'
                    }}
                  >
                    {courseName}
                  </span>
                  <span className="text-gray-400">
                    {percentage.toFixed(0)}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: getPercentageColor(percentage),
                      width: `${percentage}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
