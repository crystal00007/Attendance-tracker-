import React, { useState, useCallback, useEffect } from 'react';
import { ClassEntry, DayOfWeek, AttendanceRecord, AttendanceStatus } from './types';
import { generateColor } from './utils/colors';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import SetupPage from './pages/SetupPage';

type Page = 'dashboard' | 'setup';

const CLASSES_STORAGE_KEY = 'attendanceTracker.classes';
const ATTENDANCE_STORAGE_KEY = 'attendanceTracker.attendance';

const App: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntry[]>(() => {
    try {
      const savedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
      return savedClasses ? JSON.parse(savedClasses) : [];
    } catch (error) {
      console.error("Failed to load classes from local storage", error);
      return [];
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      return savedAttendance ? JSON.parse(savedAttendance) : [];
    } catch (error) {
      console.error("Failed to load attendance from local storage", error);
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    try {
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
    } catch (error) {
        console.error("Failed to save classes to local storage", error);
    }
  }, [classes]);

  useEffect(() => {
    try {
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
    } catch (error) {
        console.error("Failed to save attendance to local storage", error);
    }
  }, [attendance]);

  const addClassWithColor = (newClass: Omit<ClassEntry, 'id' | 'color'>): ClassEntry => {
    return {
      ...newClass,
      id: new Date().toISOString() + Math.random(),
      color: generateColor(newClass.courseName),
    }
  }

  const handleAddClass = useCallback((newClass: Omit<ClassEntry, 'id' | 'color'>) => {
    setClasses(prevClasses => [
      ...prevClasses,
      addClassWithColor(newClass)
    ]);
  }, []);

  const handleDeleteClass = useCallback((id: string) => {
    setClasses(prevClasses => prevClasses.filter(c => c.id !== id));
    setAttendance(prevAtt => prevAtt.filter(a => a.classId !== id));
  }, []);

  const handleProcessPaste = useCallback((text: string) => {
    const newClasses: Omit<ClassEntry, 'id' | 'color'>[] = [];
    const rows = text.trim().split('\n');
    
    rows.forEach(row => {
      const columns = row.split(/\t|,/); // Split by tab or comma
      if (columns.length >= 4) {
        const [courseName, dayStr, startTime, endTime] = columns.map(s => s.trim());
        const day = Object.values(DayOfWeek).find(d => d.toLowerCase() === dayStr.toLowerCase());

        if (courseName && day && startTime && endTime) {
            newClasses.push({ courseName, day, startTime, endTime });
        }
      }
    });

    if (newClasses.length > 0) {
        setClasses(prevClasses => [
            ...prevClasses,
            ...newClasses.map(c => addClassWithColor(c))
        ]);
        alert(`${newClasses.length} class(es) added successfully!`);
    } else {
        alert("Couldn't parse any valid classes. Please check the format.");
    }
  }, []);

  const handleMarkAttendance = useCallback((classId: string, date: string) => {
    setAttendance(prev => {
        const existingRecordIndex = prev.findIndex(a => a.classId === classId && a.date === date);
        const nextStatusOrder = [
            AttendanceStatus.Unmarked,
            AttendanceStatus.Present,
            AttendanceStatus.Absent,
            AttendanceStatus.Special,
        ];
        
        const newAttendance = [...prev];

        if (existingRecordIndex > -1) {
            const currentStatus = newAttendance[existingRecordIndex].status;
            const nextIndex = (nextStatusOrder.indexOf(currentStatus) + 1) % nextStatusOrder.length;
            newAttendance[existingRecordIndex] = { ...newAttendance[existingRecordIndex], status: nextStatusOrder[nextIndex] };
        } else {
            newAttendance.push({ classId, date, status: AttendanceStatus.Present });
        }
        return newAttendance.filter(r => r.status !== AttendanceStatus.Unmarked);
    });
  }, []);

  const handleResetData = useCallback(() => {
    if (window.confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      try {
        localStorage.removeItem(CLASSES_STORAGE_KEY);
        localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
        setClasses([]);
        setAttendance([]);
        alert("All data has been reset.");
      } catch (error) {
        console.error("Failed to reset data", error);
        alert("There was an error while trying to reset your data.");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        {currentPage === 'dashboard' && (
            <DashboardPage 
                classes={classes}
                attendance={attendance}
                onMarkAttendance={handleMarkAttendance}
            />
        )}

        {currentPage === 'setup' && (
            <SetupPage 
                classes={classes}
                onAddClass={handleAddClass}
                onDeleteClass={handleDeleteClass}
                onProcessPaste={handleProcessPaste}
                onResetData={handleResetData}
            />
        )}
      </main>
    </div>
  );
};

export default App;