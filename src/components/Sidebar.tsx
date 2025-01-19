import React from 'react';
import { Plus, Calendar, AlertCircle, FolderKanban, Clock, CalendarDays } from 'lucide-react';

interface SidebarProps {
  onNewTask: () => void;
  onNewRecurringTask: () => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  completionPercentage: number;
  selectedDate: string;
  onCalendarOpen: () => void;
}

export function Sidebar({
  onNewTask,
  onNewRecurringTask,
  selectedFilter,
  onFilterChange,
  completionPercentage,
  selectedDate,
  onCalendarOpen
}: SidebarProps) {
  return (
    <div className="w-1/5 min-w-64 bg-gray-900 h-screen p-6 border-r border-blue-500/20">
      <div className="space-y-3">
        <button
          onClick={onNewTask}
          className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover-glow"
        >
          <Plus size={20} />
          New Task
        </button>
        <button
          onClick={onNewRecurringTask}
          className="w-full glass-effect text-blue-400 rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-900/30 transition-all"
        >
          <Clock size={20} />
          New Recurring Task
        </button>
      </div>

      <div className="mt-8 glass-effect rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-blue-300">Progress</span>
          <span className="text-sm font-bold text-blue-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out sci-fi-glow"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-blue-400 font-medium mb-3 text-sm uppercase tracking-wider">Timeline</h2>
        <div className="space-y-1">
          <button
            onClick={onCalendarOpen}
            className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all ${
              selectedFilter === 'calendar' 
                ? 'bg-blue-600/20 text-blue-400 sci-fi-glow' 
                : 'hover:bg-blue-900/30 text-gray-400'
            }`}
          >
            <CalendarDays size={18} />
            All
          </button>
          <button
            onClick={() => onFilterChange('today')}
            className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all ${
              selectedFilter === 'today' 
                ? 'bg-blue-600/20 text-blue-400 sci-fi-glow' 
                : 'hover:bg-blue-900/30 text-gray-400'
            }`}
          >
            <Calendar size={18} />
            Today
          </button>
          <button
            onClick={() => onFilterChange('tomorrow')}
            className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all ${
              selectedFilter === 'tomorrow' 
                ? 'bg-blue-600/20 text-blue-400 sci-fi-glow' 
                : 'hover:bg-blue-900/30 text-gray-400'
            }`}
          >
            <Calendar size={18} />
            Tomorrow
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-blue-400 font-medium mb-3 text-sm uppercase tracking-wider">Priority</h2>
        <div className="space-y-1">
          {['high', 'medium', 'low'].map((priority) => (
            <button
              key={priority}
              onClick={() => onFilterChange(priority)}
              className={`flex items-center gap-2 w-full p-3 rounded-xl capitalize transition-all ${
                selectedFilter === priority 
                  ? 'bg-blue-600/20 text-blue-400 sci-fi-glow' 
                  : 'hover:bg-blue-900/30 text-gray-400'
              }`}
            >
              <AlertCircle size={18} />
              {priority}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-blue-400 font-medium mb-3 text-sm uppercase tracking-wider">Projects</h2>
        <button
          onClick={() => onFilterChange('projects')}
          className={`flex items-center gap-2 w-full p-3 rounded-xl transition-all ${
            selectedFilter === 'projects' 
              ? 'bg-blue-600/20 text-blue-400 sci-fi-glow' 
              : 'hover:bg-blue-900/30 text-gray-400'
          }`}
        >
          <FolderKanban size={18} />
          All Projects
        </button>
      </div>
    </div>
  );
}