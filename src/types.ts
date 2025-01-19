export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  projectId: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  subTasks: SubTask[];
  isRecurring?: boolean;
  recurringDays?: string[];
}

export interface Project {
  id: string;
  name: string;
}

export interface CalendarDay {
  date: string;
  tasks: Task[];
}