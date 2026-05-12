'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { problemsApi, goalsApi } from '@/lib/api';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topics: string;
  solvedAt: string;
}

interface Goal {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Redirect if not authenticated
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
        setProblems(problemsData);
        setGoals(goalsData);
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
        topics: formData.get('topics') as string,
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            DevTrack
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-cyan-100">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/40 backdrop-blur border border-cyan-500/20 rounded-lg p-6">
            <div className="text-cyan-400 text-sm font-semibold mb-2">PROBLEMS SOLVED</div>
            <div className="text-4xl font-bold text-white mb-4">{problems.length}</div>
            <button
              onClick={() => setShowProblemForm(!showProblemForm)}
              className="px-4 py-2 bg-cyan-600/80 hover:bg-cyan-700 text-white rounded-lg transition w-full"
            >
              {showProblemForm ? 'Cancel' : '+ Add Problem'}
            </button>

            {showProblemForm && (
              <form onSubmit={handleAddProblem} className="mt-4 space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Problem Title"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-cyan-400/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <select
                  name="difficulty"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-cyan-400/30 rounded text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <input
                  type="text"
                  name="topics"
                  placeholder="Topics (e.g., Arrays, Strings)"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-cyan-400/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white rounded-lg transition font-semibold"
                >
                  Save Problem
                </button>
              </form>
            )}
          </div>

          <div className="bg-slate-800/40 backdrop-blur border border-cyan-500/20 rounded-lg p-6">
            <div className="text-cyan-400 text-sm font-semibold mb-2">ACTIVE GOALS</div>
            <div className="text-4xl font-bold text-white mb-4">{goals.filter(g => !g.completed).length}</div>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="px-4 py-2 bg-cyan-600/80 hover:bg-cyan-700 text-white rounded-lg transition w-full"
            >
              {showGoalForm ? 'Cancel' : '+ Add Goal'}
            </button>

            {showGoalForm && (
              <form onSubmit={handleAddGoal} className="mt-4 space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Goal Title"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-cyan-400/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="date"
                  name="dueDate"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-cyan-400/30 rounded text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white rounded-lg transition font-semibold"
                >
                  Save Goal
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Problems Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            Recent Problems
          </h2>
          {problems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-slate-800/40 backdrop-blur border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition"
                >
                  <h3 className="text-white font-semibold mb-2">{problem.title}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      problem.difficulty === 'Easy' ? 'bg-green-900/40 text-green-300' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-900/40 text-yellow-300' :
                      'bg-red-900/40 text-red-300'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-cyan-900/40 text-cyan-300">
                      {problem.topics}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="w-full px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No problems added yet. Start by adding your first problem!
            </div>
          )}
        </section>

        {/* Goals Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            Your Goals
          </h2>
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`backdrop-blur border rounded-lg p-4 hover:border-cyan-500/50 transition ${
                    goal.completed
                      ? 'bg-slate-800/20 border-gray-500/20'
                      : 'bg-slate-800/40 border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${goal.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      readOnly
                      className="w-5 h-5 accent-cyan-400"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="w-full px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No goals added yet. Set your learning goals!
            </div>
          )}
        </section>
      </main>
    </div>
  );
}