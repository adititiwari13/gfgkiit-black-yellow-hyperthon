import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { Project, SubTask } from '../types';

interface RecurringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    projectId: string;
    subTasks: SubTask[];
    recurringDays: string[];
  }) => void;
  projects: Project[];
}

export function RecurringTaskModal({ isOpen, onClose, onSave, projects }: RecurringTaskModalProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTask, setNewSubTask] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([
        ...subTasks,
        { id: crypto.randomUUID(), title: newSubTask, completed: false }
      ]);
      setNewSubTask('');
    }
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter(task => task.id !== id));
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      projectId,
      subTasks,
      recurringDays: selectedDays
    });
    setTitle('');
    setProjectId('');
    setSubTasks([]);
    setSelectedDays([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">New Recurring Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat on
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${selectedDays.includes(day)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtasks
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  placeholder="Add a subtask"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubTask}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                </button>
              </div>
              <ul className="space-y-2">
                {subTasks.map((subTask) => (
                  <li
                    key={subTask.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                  >
                    <span>{subTask.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubTask(subTask.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Recurring Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}