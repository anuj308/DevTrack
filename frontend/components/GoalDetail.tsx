'use client';

interface Goal {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface GoalDetailProps {
  goal: Goal;
  onClose: () => void;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number, completed: boolean) => void;
  darkMode: boolean;
}

export default function GoalDetail({
  goal,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete,
  darkMode,
}: GoalDetailProps) {
  const dueDate = new Date(goal.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = () => {
    if (goal.completed) return 'bg-green-500/20 text-green-400 border-green-500';
    if (daysUntilDue < 0) return 'bg-red-500/20 text-red-400 border-red-500';
    if (daysUntilDue <= 3) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    return 'bg-blue-500/20 text-blue-400 border-blue-500';
  };

  const getStatusText = () => {
    if (goal.completed) return '✓ Completed';
    if (daysUntilDue < 0) return `⚠️ Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return '📍 Due today';
    if (daysUntilDue === 1) return '⏰ Due tomorrow';
    return `📅 ${daysUntilDue} days left`;
  };

  const bgClass = darkMode ? 'bg-slate-900' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const borderClass = darkMode ? 'border-slate-700' : 'border-slate-200';
  const secondaryText = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in sm:items-center">
      <div
        className={`${bgClass} w-full max-h-[85vh] overflow-y-auto rounded-t-2xl border ${borderClass} shadow-2xl animate-in slide-in-from-bottom-5 sm:w-2/3 sm:rounded-2xl lg:w-1/2`}
      >
        {/* Header */}
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} flex items-start justify-between px-5 py-3`}>
          <div className="flex-1">
            <h2 className={`text-xl font-bold ${textClass} wrap-break-word`}>
              {goal.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 shrink-0 rounded-lg p-2 transition ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-5 py-4">
          {/* Status */}
          <div className={`rounded-lg border p-3 ${getStatusColor()}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-75">Status</p>
                <p className="mt-1 text-base font-bold">{getStatusText()}</p>
              </div>
              {!goal.completed && onToggleComplete && (
                <button
                  onClick={() => onToggleComplete(goal.id, true)}
                  className="rounded-lg bg-green-600/80 px-3 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  ✓ Mark Done
                </button>
              )}
              {goal.completed && onToggleComplete && (
                <button
                  onClick={() => onToggleComplete(goal.id, false)}
                  className={`rounded-lg border px-3 py-2 font-medium transition ${
                    darkMode
                      ? 'border-slate-700 hover:bg-slate-800'
                      : 'border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ↶ Undo
                </button>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className={`rounded-lg border p-3 ${borderClass} ${
            darkMode ? 'bg-slate-800/30' : 'bg-slate-50'
          }`}>
            <p className={`text-sm font-semibold ${secondaryText} mb-2`}>
              Due Date
            </p>
            <p className={`text-base font-mono ${textClass}`}>
              {dueDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Metadata */}
          <div className={`space-y-2 border-t pt-3 ${borderClass}`}>
            <div className="flex justify-between">
              <span className={secondaryText}>Goal ID:</span>
              <span className={textClass}>{goal.id}</span>
            </div>
            <div className="flex justify-between">
              <span className={secondaryText}>Created:</span>
              <span className={textClass}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 border-t px-5 py-3 ${borderClass} bg-slate-800/20`}>
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="flex-1 rounded-lg bg-cyan-600/80 px-3 py-2 font-medium text-white transition hover:bg-cyan-700"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete(goal.id);
                onClose();
              }}
              className="flex-1 rounded-lg bg-red-600/80 px-3 py-2 font-medium text-white transition hover:bg-red-700"
            >
              🗑️ Delete
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 rounded-lg border px-3 py-2 font-medium transition ${
              darkMode
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
