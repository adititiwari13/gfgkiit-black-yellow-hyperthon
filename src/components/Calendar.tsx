import React from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectDate: (date: string) => void;
}

export function Calendar({ isOpen, onClose, tasks, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  if (!isOpen) return null;

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getTasksForDate = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    return tasks.filter(task => task.deadline === date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    onSelectDate(selectedDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-blue-400">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-blue-900/30 rounded-full transition-colors text-blue-400"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-blue-900/30 rounded-full transition-colors text-blue-400"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={onClose}
              className="ml-2 px-3 py-1 text-sm text-blue-400 hover:bg-blue-900/30 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-blue-400/60 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {previousMonthDays.map(day => (
            <div
              key={`prev-${day}`}
              className="aspect-square p-1 text-center text-gray-600"
            />
          ))}
          
          {days.map(day => {
            const tasksForDay = getTasksForDate(day);
            const hasHighPriority = tasksForDay.some(task => task.priority === 'high');
            const hasTasks = tasksForDay.length > 0;
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square p-1 relative group hover:bg-blue-900/30 rounded-lg transition-all
                  ${currentDate.getDate() === day ? 'bg-blue-600/20 sci-fi-glow' : ''}
                `}
              >
                <span className={`
                  text-sm ${currentDate.getDate() === day ? 'font-bold text-blue-400' : 'text-gray-400'}
                `}>
                  {day}
                </span>
                {hasTasks && (
                  <div className={`
                    absolute bottom-1 left-1/2 transform -translate-x-1/2
                    w-1.5 h-1.5 rounded-full sci-fi-glow
                    ${hasHighPriority ? 'bg-red-500' : 'bg-blue-500'}
                  `} />
                )}
                {hasTasks && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-900/30 transition-opacity rounded-lg">
                    <span className="text-xs font-medium text-blue-400">
                      {tasksForDay.length} task{tasksForDay.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}