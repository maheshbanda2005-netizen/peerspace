import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  MoreVertical,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Task, TaskStatus, Priority } from '../types';
import confetti from 'canvas-confetti';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onAddTask: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'TODO', label: 'To Do', color: 'border-slate-700 text-slate-300' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-violet-500/50 text-violet-300' },
  { id: 'REVIEW', label: 'In Review', color: 'border-amber-500/50 text-amber-300' },
  { id: 'COMPLETED', label: 'Completed', color: 'border-emerald-500/50 text-emerald-300' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateTasks,
  onAddTask,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM');
  const [taskCategory, setTaskCategory] = useState<string>('CS162');
  const [taskDueDate, setTaskDueDate] = useState<string>('Tomorrow, 5:00 PM');
  const [taskEstMins, setTaskEstMins] = useState<number>(45);

  const [filterPriority, setFilterPriority] = useState<string>('all');

  const moveTask = (taskId: string, targetStatus: TaskStatus) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        if (targetStatus === 'COMPLETED' && t.status !== 'COMPLETED') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
        return {
          ...t,
          status: targetStatus,
          completedAt: targetStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'TODO': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'REVIEW';
      case 'REVIEW': return 'COMPLETED';
      default: return null;
    }
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'COMPLETED': return 'REVIEW';
      case 'REVIEW': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'TODO';
      default: return null;
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      status: 'TODO',
      priority: taskPriority,
      category: taskCategory.trim() || 'General',
      dueDate: taskDueDate.trim() || 'This week',
      estimatedMinutes: taskEstMins || 30,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    setTaskTitle('');
    setTaskDesc('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter(t =>
    filterPriority === 'all' ? true : t.priority === filterPriority
  );

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'URGENT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'LOW':
        return 'bg-slate-700/50 text-slate-300 border-slate-600/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Study Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Optimistic state transitions for assignments, problem sets, and study goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none shadow-xs font-semibold"
          >
            <option value="all">All Priorities</option>
            <option value="URGENT">Urgent Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className="glass-panel rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 flex flex-col min-h-[500px] shadow-sm dark:shadow-xl"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'TODO'
                      ? 'bg-slate-400'
                      : col.id === 'IN_PROGRESS'
                      ? 'bg-violet-500'
                      : col.id === 'REVIEW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`} />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{col.label}</h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-36 border border-dashed border-slate-300 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-medium">
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map(task => {
                    const next = getNextStatus(task.status);
                    const prev = getPrevStatus(task.status);
                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/5 hover:border-violet-400/50 dark:hover:border-violet-500/30 transition-all space-y-2.5 shadow-sm dark:shadow-lg group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                            {task.category}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            task.priority === 'URGENT'
                              ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                              : task.priority === 'HIGH'
                              ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                              : task.priority === 'MEDIUM'
                              ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30'
                              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600/30'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-snug">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5 font-mono font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {task.dueDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.estimatedMinutes}m
                          </span>
                        </div>

                        {/* Quick Advancement buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                          {prev ? (
                            <button
                              onClick={() => moveTask(task.id, prev)}
                              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-[10px] font-semibold flex items-center gap-1"
                              title="Move backward"
                            >
                              <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                          ) : <div />}

                          {next ? (
                            <button
                              onClick={() => moveTask(task.id, next)}
                              className="p-1 rounded-lg text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors text-[10px] font-bold flex items-center gap-1 ml-auto"
                              title="Advance status"
                            >
                              Advance <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1 ml-auto">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Study Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Raft Log Replication"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Steps or notes to complete..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Course / Tag</label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value)}
                    placeholder="CS162, Math 53"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Due Date</label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    placeholder="Tomorrow, 11:59 PM"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={taskEstMins}
                    onChange={e => setTaskEstMins(parseInt(e.target.value) || 30)}
                    min={5}
                    max={360}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-600/30"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

