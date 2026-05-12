'use client';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topics: string;
  link?: string;
  notes?: string;
  listId?: number;
  listName?: string;
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
  const difficultyClasses: Record<string, string> = {
    Easy: 'bg-green-500/20 border-green-500 text-green-400',
    Medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    Hard: 'bg-red-500/20 border-red-500 text-red-400',
  };

  const bgClass = darkMode ? 'bg-slate-900' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const borderClass = darkMode ? 'border-slate-700' : 'border-slate-200';
  const secondaryText = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in sm:items-center">
      <div
        className={`${bgClass} w-full max-h-[90vh] overflow-y-auto rounded-t-2xl border ${borderClass} shadow-2xl animate-in slide-in-from-bottom-5 sm:w-2/3 sm:rounded-2xl lg:w-1/2`}
      >
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4 flex items-start justify-between gap-4`}>
          <div className="min-w-0 flex-1">
            <h2 className={`text-2xl font-bold ${textClass} wrap-break-word`}>
              {problem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`shrink-0 rounded-lg p-2 transition ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="space-y-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${
                difficultyClasses[problem.difficulty] || difficultyClasses.Easy
              }`}
            >
              {problem.difficulty}
            </span>

            {problem.listName && (
              <div className={`rounded-xl border p-4 ${borderClass} ${darkMode ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                <p className={`mb-2 text-sm font-semibold ${secondaryText}`}>List</p>
                <p className={textClass}>{problem.listName}</p>
              </div>
            )}

            {problem.topics && (
              <div>
                <p className={`mb-2 text-sm font-semibold ${secondaryText}`}>Topics</p>
                <div className="flex flex-wrap gap-2">
                  {problem.topics.split(',').map((topic, index) => (
                    <span
                      key={index}
                      className={`rounded-full px-3 py-1 text-sm ${
                        darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {problem.link && (
            <div className={`rounded-xl border p-4 ${borderClass} ${darkMode ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
              <p className={`mb-2 text-sm font-semibold ${secondaryText}`}>Open / Solve Problem</p>
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600/15 px-4 py-3 text-sm font-medium text-cyan-500 transition hover:bg-cyan-600/25 hover:text-cyan-400"
              >
                ↗ Open problem URL
              </a>
              <p className={`mt-2 break-all text-xs ${secondaryText}`}>{problem.link}</p>
            </div>
          )}

          {problem.notes && (
            <div>
              <p className={`mb-2 text-sm font-semibold ${secondaryText}`}>Notes</p>
              <div className={`rounded-xl border p-4 whitespace-pre-wrap wrap-break-word ${borderClass} ${darkMode ? 'bg-slate-800/30' : 'bg-slate-50'} ${textClass}`}>
                {problem.notes}
              </div>
            </div>
          )}

          <div className={`space-y-2 border-t pt-4 ${borderClass}`}>
            {problem.solvedAt && (
              <div className="flex justify-between gap-4">
                <span className={secondaryText}>Solved at:</span>
                <span className={textClass}>{new Date(problem.solvedAt).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className={secondaryText}>Problem ID:</span>
              <span className={textClass}>{problem.id}</span>
            </div>
          </div>
        </div>

        <div className={`flex gap-3 border-t px-6 py-4 ${borderClass} bg-slate-800/20`}>
          {onEdit && (
            <button
              onClick={() => onEdit(problem)}
              className="flex-1 rounded-lg bg-cyan-600/80 px-4 py-2 font-medium text-white transition hover:bg-cyan-700"
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
              className="flex-1 rounded-lg bg-red-600/80 px-4 py-2 font-medium text-white transition hover:bg-red-700"
            >
              🗑️ Delete
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 rounded-lg border px-4 py-2 font-medium transition ${
              darkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
