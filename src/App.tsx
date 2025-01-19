import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { NewTaskModal } from './components/NewTaskModal';
import { RecurringTaskModal } from './components/RecurringTaskModal';
import { Calendar } from './components/Calendar';
import { TaskList } from './components/TaskList';
import { Task, Project, SubTask } from './types';

function App() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isRecurringTaskModalOpen, setIsRecurringTaskModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects] = useState<Project[]>([
    { id: '1', name: 'Personal' },
    { id: '2', name: 'Work' },
    { id: '3', name: 'Shopping' },
  ]);

  useEffect(() => {
    // Check for recurring tasks and create new instances
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const recurringTasks = tasks.filter(task => 
      task.isRecurring && task.recurringDays?.includes(today)
    );

    recurringTasks.forEach(task => {
      const existingTask = tasks.find(t => 
        !t.isRecurring && 
        t.title === task.title && 
        t.deadline === new Date().toISOString().split('T')[0]
      );

      if (!existingTask) {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          isRecurring: false,
          deadline: new Date().toISOString().split('T')[0],
          completed: false,
          subTasks: task.subTasks.map(st => ({ ...st, completed: false }))
        };
        setTasks(prev => [...prev, newTask]);
      }
    });
  }, [tasks]);

  const calculatePriority = (deadline: string): 'high' | 'medium' | 'low' => {
    const daysUntilDeadline = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDeadline <= 2) return 'high';
    if (daysUntilDeadline <= 5) return 'medium';
    return 'low';
  };

  const handleNewTask = (taskData: {
    title: string;
    deadline: string;
    projectId: string;
    subTasks: SubTask[];
  }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      deadline: taskData.deadline,
      projectId: taskData.projectId,
      priority: calculatePriority(taskData.deadline),
      completed: false,
      subTasks: taskData.subTasks,
    };

    setTasks([...tasks, newTask]);
  };

  const handleNewRecurringTask = (taskData: {
    title: string;
    projectId: string;
    subTasks: SubTask[];
    recurringDays: string[];
  }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      deadline: new Date().toISOString().split('T')[0],
      projectId: taskData.projectId,
      priority: 'medium',
      completed: false,
      subTasks: taskData.subTasks,
      isRecurring: true,
      recurringDays: taskData.recurringDays,
    };

    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          subTasks: task.subTasks.map(st => ({ ...st, completed: !task.completed }))
        };
      }
      return task;
    }));
  };

  const handleToggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubTasks = task.subTasks.map(st =>
          st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );
        const allCompleted = updatedSubTasks.every(st => st.completed);
        return {
          ...task,
          completed: allCompleted,
          subTasks: updatedSubTasks
        };
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    if (task.isRecurring) return false;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    switch (selectedFilter) {
      case 'today':
        return task.deadline === today;
      case 'tomorrow':
        return task.deadline === tomorrow;
      case 'calendar':
        return task.deadline === selectedDate;
      case 'high':
      case 'medium':
      case 'low':
        return task.priority === selectedFilter;
      default:
        return true;
    }
  });

  const completionPercentage = filteredTasks.length
    ? Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-gray-900 grid-bg">
      <Sidebar
        onNewTask={() => setIsNewTaskModalOpen(true)}
        onNewRecurringTask={() => setIsRecurringTaskModalOpen(true)}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        completionPercentage={completionPercentage}
        selectedDate={selectedDate}
        onCalendarOpen={() => {
          setIsCalendarOpen(true);
          setSelectedFilter('calendar');
        }}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">
          {selectedFilter === 'projects' ? 'All Projects' : 
           selectedFilter === 'today' ? "Today's Tasks" :
           selectedFilter === 'tomorrow' ? "Tomorrow's Tasks" :
           selectedFilter === 'calendar' ? `Tasks for ${new Date(selectedDate).toLocaleDateString()}` :
           `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Priority Tasks`}
        </h1>
        
        <TaskList
          tasks={filteredTasks}
          onToggleTask={handleToggleTask}
          onToggleSubTask={handleToggleSubTask}
        />
      </main>

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSave={handleNewTask}
        projects={projects}
      />

      <RecurringTaskModal
        isOpen={isRecurringTaskModalOpen}
        onClose={() => setIsRecurringTaskModalOpen(false)}
        onSave={handleNewRecurringTask}
        projects={projects}
      />

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        tasks={tasks.filter(t => !t.isRecurring)}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setSelectedFilter('calendar');
        }}
      />
    </div>
  );
}

export default App;