import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
}

export function TaskList({ tasks, onToggleTask, onToggleSubTask }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="glass-effect rounded-xl p-4 hover-glow transition-all border border-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleTask(task.id)}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle className="text-blue-400" size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              <div>
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-blue-300'}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          {task.subTasks.length > 0 && (
            <div className="mt-4 ml-8 space-y-2">
              {task.subTasks.map((subTask) => (
                <div key={subTask.id} className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleSubTask(task.id, subTask.id)}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {subTask.completed ? (
                      <CheckCircle className="text-blue-400" size={16} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </button>
                  <span className={subTask.completed ? 'line-through text-gray-500' : 'text-gray-300'}>
                    {subTask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}