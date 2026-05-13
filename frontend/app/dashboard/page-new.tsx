'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { problemsApi, goalsApi } from '@/lib/api';
import { Sun, Moon, Trash2, Plus, ChevronDown } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  link?: string;
  notes?: string;
  listId?: number;
  solvedAt?: string;
}

interface Goal {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface List {
  id: number;
  name: string;
  problemCount: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-green-500/20 border-green-500/30 text-green-400',
  Medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  Hard: 'bg-red-500/20 border-red-500/30 text-red-400',
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [lists, setLists] = useState<List[]>([
    { id: 1, name: 'Default', problemCount: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(1);

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsData, goalsData] = await Promise.all([
          problemsApi.getAll(),
          goalsApi.getAll(),
        ]);
        setProblems(problemsData || []);
        setGoals(goalsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const handleAddProblem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const newProblem = await problemsApi.create({
        title: formData.get('title') as string,
        difficulty: formData.get('difficulty') as string,
      });

      setProblems([...problems, newProblem]);
      setShowProblemForm(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const handleAddGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const newGoal = await goalsApi.create({
        title: formData.get('title') as string,
        dueDate: formData.get('dueDate') as string,
      });

      setGoals([...goals, newGoal]);
      setShowGoalForm(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleAddList = () => {
    if (newListName.trim()) {
      const newList: List = {
        id: Math.max(...lists.map(l => l.id), 0) + 1,
        name: newListName,
        problemCount: 0,
      };
      setLists([...lists, newList]);
      setNewListName('');
      setShowListForm(false);
    }
  };

  const handleDeleteProblem = async (id: number) => {
    try {
      await problemsApi.delete(id);
      setProblems(problems.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await goalsApi.delete(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const bgClass = darkMode ? 'bg-slate-950' : 'bg-slate-50';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const cardClass = darkMode
    ? 'bg-slate-900/60 border-slate-700'
    : 'bg-white border-slate-200';
  const inputClass = darkMode
    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500';

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen ${bgClass} ${textClass} flex items-center justify-center`}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'} backdrop-blur`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            DevTrack
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
              Welcome, {session?.user?.name || session?.user?.email}!
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`${cardClass} border rounded-lg p-6 backdrop-blur`}>
            <div className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'} text-sm font-semibold mb-2`}>
              PROBLEMS SOLVED
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-4`}>{problems.length}</div>
            <button
              onClick={() => setShowProblemForm(!showProblemForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${darkMode ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400' : 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600'}`}
            >
              <Plus size={18} /> Add Problem
            </button>
          </div>

          <div className={`${cardClass} border rounded-lg p-6 backdrop-blur`}>
            <div className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} text-sm font-semibold mb-2`}>
              GOALS
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-4`}>{goals.length}</div>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${darkMode ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400' : 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-600'}`}
            >
              <Plus size={18} /> Add Goal
            </button>
          </div>

          <div className={`${cardClass} border rounded-lg p-6 backdrop-blur`}>
            <div className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-sm font-semibold mb-2`}>
              LISTS
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-4`}>{lists.length}</div>
            <button
              onClick={() => setShowListForm(!showListForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${darkMode ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400' : 'bg-green-600/10 hover:bg-green-600/20 text-green-600'}`}
            >
              <Plus size={18} /> New List
            </button>
          </div>
        </div>

        {/* New List Form */}
        {showListForm && (
          <div className={`${cardClass} border rounded-lg p-6 mb-8 backdrop-blur`}>
            <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Create New List</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="List name (e.g., 'Algorithms', 'Data Structures')"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg border ${inputClass}`}
              />
              <button
                onClick={handleAddList}
                className={`px-6 py-2 rounded-lg transition ${darkMode ? 'bg-green-600/80 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                Create
              </button>
              <button
                onClick={() => setShowListForm(false)}
                className={`px-6 py-2 rounded-lg border transition ${darkMode ? 'border-slate-700 hover:bg-slate-800/50' : 'border-slate-300 hover:bg-slate-100'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Problem Form */}
        {showProblemForm && (
          <div className={`${cardClass} border rounded-lg p-6 mb-8 backdrop-blur`}>
            <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Add New Problem</h3>
            <form onSubmit={handleAddProblem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Problem title"
                  required
                  className={`px-4 py-2 rounded-lg border ${inputClass}`}
                />
                <select
                  name="difficulty"
                  required
                  className={`px-4 py-2 rounded-lg border ${inputClass}`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <input
                  type="url"
                  name="link"
                  placeholder="Problem link (optional)"
                  className={`px-4 py-2 rounded-lg border ${inputClass}`}
                />
              </div>
              <textarea
                name="notes"
                placeholder="Notes (optional)"
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg transition ${darkMode ? 'bg-cyan-600/80 hover:bg-cyan-700 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}
                >
                  Save Problem
                </button>
                <button
                  type="button"
                  onClick={() => setShowProblemForm(false)}
                  className={`px-6 py-2 rounded-lg border transition ${darkMode ? 'border-slate-700 hover:bg-slate-800/50' : 'border-slate-300 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Goal Form */}
        {showGoalForm && (
          <div className={`${cardClass} border rounded-lg p-6 mb-8 backdrop-blur`}>
            <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Add New Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Goal title"
                  required
                  className={`px-4 py-2 rounded-lg border ${inputClass}`}
                />
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={getTodayDate()}
                  required
                  className={`px-4 py-2 rounded-lg border ${inputClass}`}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg transition ${darkMode ? 'bg-purple-600/80 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                >
                  Save Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className={`px-6 py-2 rounded-lg border transition ${darkMode ? 'border-slate-700 hover:bg-slate-800/50' : 'border-slate-300 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Problems Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold ${textClass} mb-6`}>Problems</h2>
          {problems.length === 0 ? (
            <div className={`${cardClass} border rounded-lg p-8 text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              No problems yet. Create one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className={`${cardClass} border rounded-lg p-6 backdrop-blur hover:border-cyan-500/50 transition`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-lg font-semibold ${textClass} flex-1`}>{problem.title}</h3>
                    <button
                      onClick={() => handleDeleteProblem(problem.id)}
                      className={`p-2 rounded transition ${darkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS['Easy']}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  {problem.link && (
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-2 truncate`}>
                      <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                        View Problem
                      </a>
                    </p>
                  )}
                  {problem.notes && (
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm line-clamp-2`}>
                      Notes: {problem.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Goals Section */}
        <section>
          <h2 className={`text-2xl font-bold ${textClass} mb-6`}>Goals</h2>
          {goals.length === 0 ? (
            <div className={`${cardClass} border rounded-lg p-8 text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              No goals yet. Create one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`${cardClass} border rounded-lg p-6 backdrop-blur hover:border-purple-500/50 transition`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-lg font-semibold ${textClass} flex-1`}>{goal.title}</h3>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className={`p-2 rounded transition ${darkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                  <div className={`flex items-center justify-between`}>
                    <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      Due: {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${goal.completed ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {goal.completed ? '✓ Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
