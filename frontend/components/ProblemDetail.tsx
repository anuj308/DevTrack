'use client';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topics: string;
  link?: string;
  notes?: string;
  listId?: number;
  solvedAt?: string;
}

interface ProblemDetailProps {
  problem: Problem;
  onClose: () => void;
  onEdit?: (problem: Problem) => void;
  onDelete?: (id: number) => void;
  darkMode: boolean;
}

export default function ProblemDetail({
  problem,
  onClose,
  onEdit,
  onDelete,
  darkMode,
}: ProblemDetailProps) {
  const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'bg-green-500/20 border-green-500 text-green-400',
    Medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    Hard: 'bg-red-500/20 border-red-500 text-red-400',
  };

  const bgClass = darkMode ? 'bg-slate-900' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const borderClass = darkMode ? 'border-slate-700' : 'border-slate-200';
  const secondaryText = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-in fade-in">
      <div
        className={`${bgClass} w-full sm:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border ${borderClass} shadow-2xl animate-in slide-in-from-bottom-5 sm:slide-in-from-center-0`}
      >
        {/* Header */}
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4 flex justify-between items-start`}>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${textClass} break-words`}>
              {problem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 p-2 rounded-lg transition flex-shrink-0 ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Difficulty & Topics */}
          <div className="space-y-3">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                  DIFFICULTY_COLORS[problem.difficulty] ||
                  DIFFICULTY_COLORS['Easy']
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            {problem.topics && (
              <div>
                <p className={`text-sm font-semibold ${secondaryText} mb-2`}>
                  Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {problem.topics.split(',').map((topic, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Problem Link */}
          {problem.link && (
            <div className={`p-4 rounded-lg border ${borderClass} ${
              darkMode ? 'bg-slate-800/30' : 'bg-slate-50'
            }`}>
              <p className={`text-sm font-semibold ${secondaryText} mb-2`}>
                Problem Link
              </p>
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 hover:text-cyan-400 break-all font-mono text-sm"
              >
                {problem.link}
              </a>
            </div>
          )}

          {/* Notes */}
          {problem.notes && (
            <div>
              <p className={`text-sm font-semibold ${secondaryText} mb-2`}>
                Notes
              </p>
              <div
                className={`p-4 rounded-lg border ${borderClass} ${
                  darkMode ? 'bg-slate-800/30' : 'bg-slate-50'
                } whitespace-pre-wrap break-words ${textClass}`}
              >
                {problem.notes}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className={`pt-4 border-t ${borderClass} space-y-2`}>
            {problem.solvedAt && (
              <div className="flex justify-between">
                <span className={secondaryText}>Solved at:</span>
                <span className={textClass}>
                  {new Date(problem.solvedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className={secondaryText}>Problem ID:</span>
              <span className={textClass}>{problem.id}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`border-t ${borderClass} px-6 py-4 flex gap-3 bg-slate-800/20`}>
          {onEdit && (
            <button
              onClick={() => onEdit(problem)}
              className="flex-1 px-4 py-2 bg-cyan-600/80 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete(problem.id);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              🗑️ Delete
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg transition font-medium border ${
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
