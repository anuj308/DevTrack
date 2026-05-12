'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { problemsApi, goalsApi } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import ProblemDetail from '@/components/ProblemDetail';
import GoalDetail from '@/components/GoalDetail';

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
  const [activeTab, setActiveTab] = useState<'problems' | 'goals'>('problems');
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState<number | null>(1);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

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
        // Count problems in each list
        const listCounts: Record<number, number> = {};
        (problemsData || []).forEach((p: Problem) => {
          const listId = p.listId || 1;
          listCounts[listId] = (listCounts[listId] || 0) + 1;
        });
        setLists((prevLists) =>
          prevLists.map((list) => ({
            ...list,
            problemCount: listCounts[list.id] || 0,
          }))
        );
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

  const filteredProblems = selectedList
    ? problems.filter((p) => (p.listId || 1) === selectedList)
    : problems;

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

  const handleAddList = () => {
    if (newListName.trim()) {
      const newList: List = {
        id: Math.max(...lists.map((l) => l.id), 0) + 1,
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
      setProblems(problems.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await goalsApi.delete(id);
      setGoals(goals.filter((g) => g.id !== id));
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
    ? 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
    : 'bg-white border-slate-200 hover:border-slate-300';
  const inputClass = darkMode
    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500';
  const tabActiveClass = darkMode
    ? 'border-b-2 border-cyan-500 text-cyan-400'
    : 'border-b-2 border-cyan-600 text-cyan-600';

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
      <header
        className={`sticky top-0 z-40 border-b ${
          darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200'
        } backdrop-blur`}
      >
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center ml-64">
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              DevTrack
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition text-xl ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
              }`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
              {session?.user?.name || session?.user?.email}
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

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          lists={lists}
          selectedList={selectedList}
          onSelectList={setSelectedList}
          onCreateList={() => setShowListForm(true)}
          darkMode={darkMode}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 px-4 sm:px-6 lg:px-8 py-12">
          {/* Create List Form */}
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
                  className={`px-6 py-2 rounded-lg transition ${
                    darkMode
                      ? 'bg-green-600/80 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Create
                </button>
                <button
                  onClick={() => setShowListForm(false)}
                  className={`px-6 py-2 rounded-lg border transition ${
                    darkMode
                      ? 'border-slate-700 hover:bg-slate-800/50'
                      : 'border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${cardClass} border rounded-lg p-6 backdrop-blur`}>
              <div
                className={`${
                  darkMode ? 'text-cyan-400' : 'text-cyan-600'
                } text-sm font-semibold mb-2`}
              >
                PROBLEMS
              </div>
              <div className={`text-4xl font-bold ${textClass} mb-4`}>
                {activeTab === 'problems' ? filteredProblems.length : problems.length}
              </div>
              <button
                onClick={() => setShowProblemForm(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400'
                    : 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600'
                }`}
              >
                ➕ Add Problem
              </button>
            </div>

            <div className={`${cardClass} border rounded-lg p-6 backdrop-blur`}>
              <div
                className={`${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                } text-sm font-semibold mb-2`}
              >
                GOALS
              </div>
              <div className={`text-4xl font-bold ${textClass} mb-4`}>{goals.length}</div>
              <button
                onClick={() => setShowGoalForm(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400'
                    : 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-600'
                }`}
              >
                ➕ Add Goal
              </button>
            </div>

            <div className={`${cardClass} border rounded-lg p-6 backdrop-blur`}>
              <div
                className={`${
                  darkMode ? 'text-green-400' : 'text-green-600'
                } text-sm font-semibold mb-2`}
              >
                LISTS
              </div>
              <div className={`text-4xl font-bold ${textClass} mb-4`}>{lists.length}</div>
              <button
                onClick={() => setShowListForm(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                    : 'bg-green-600/10 hover:bg-green-600/20 text-green-600'
                }`}
              >
                ➕ New List
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-6 mb-8 border-b ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('problems')}
              className={`pb-4 font-semibold transition ${
                activeTab === 'problems' ? tabActiveClass : darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              📋 Problems
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`pb-4 font-semibold transition ${
                activeTab === 'goals' ? tabActiveClass : darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              🎯 Goals
            </button>
          </div>

          {/* Add Problem Form */}
          {showProblemForm && activeTab === 'problems' && (
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
                    type="text"
                    name="topics"
                    placeholder="Topics (e.g., 'Array, Sorting')"
                    className={`px-4 py-2 rounded-lg border ${inputClass}`}
                  />
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
                    className={`px-6 py-2 rounded-lg transition ${
                      darkMode
                        ? 'bg-cyan-600/80 hover:bg-cyan-700 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    }`}
                  >
                    Save Problem
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProblemForm(false)}
                    className={`px-6 py-2 rounded-lg border transition ${
                      darkMode
                        ? 'border-slate-700 hover:bg-slate-800/50'
                        : 'border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Goal Form */}
          {showGoalForm && activeTab === 'goals' && (
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
                    className={`px-6 py-2 rounded-lg transition ${
                      darkMode
                        ? 'bg-purple-600/80 hover:bg-purple-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    Save Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className={`px-6 py-2 rounded-lg border transition ${
                      darkMode
                        ? 'border-slate-700 hover:bg-slate-800/50'
                        : 'border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Problems Content */}
          {activeTab === 'problems' && (
            <section>
              {filteredProblems.length === 0 ? (
                <div
                  className={`${cardClass} border rounded-lg p-12 text-center ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <p className="text-lg mb-4">
                    {selectedList && lists.find(l => l.id === selectedList)?.name
                      ? `No problems in "${lists.find(l => l.id === selectedList)?.name}"`
                      : 'No problems yet'}
                  </p>
                  <button
                    onClick={() => setShowProblemForm(true)}
                    className={`px-6 py-2 rounded-lg transition ${
                      darkMode
                        ? 'bg-cyan-600/80 hover:bg-cyan-700 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    }`}
                  >
                    Create one now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProblems.map((problem) => (
                    <div
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className={`${cardClass} border rounded-lg p-6 backdrop-blur transition cursor-pointer transform hover:scale-105`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-lg font-semibold ${textClass} flex-1 line-clamp-2`}>
                          {problem.title}
                        </h3>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            DIFFICULTY_COLORS[problem.difficulty] ||
                            DIFFICULTY_COLORS['Easy']
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      {problem.topics && (
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-2 line-clamp-1`}>
                          {problem.topics}
                        </p>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProblem(problem);
                        }}
                        className={`mt-4 w-full px-4 py-2 rounded-lg transition ${
                          darkMode
                            ? 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400'
                            : 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600'
                        }`}
                      >
                        👁️ View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Goals Content */}
          {activeTab === 'goals' && (
            <section>
              {goals.length === 0 ? (
                <div
                  className={`${cardClass} border rounded-lg p-12 text-center ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <p className="text-lg mb-4">No goals yet</p>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className={`px-6 py-2 rounded-lg transition ${
                      darkMode
                        ? 'bg-purple-600/80 hover:bg-purple-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    Create one now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal)}
                      className={`${cardClass} border rounded-lg p-6 backdrop-blur transition cursor-pointer transform hover:scale-105`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-lg font-semibold ${textClass} flex-1 line-clamp-2`}>
                          {goal.title}
                        </h3>
                      </div>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>
                        Due: {new Date(goal.dueDate).toLocaleDateString()}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGoal(goal);
                        }}
                        className={`w-full px-4 py-2 rounded-lg transition ${
                          goal.completed
                            ? darkMode
                              ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                              : 'bg-green-600/10 hover:bg-green-600/20 text-green-600'
                            : darkMode
                            ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400'
                            : 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-600'
                        }`}
                      >
                        {goal.completed ? '✓ Completed' : '⏳ In Progress'} • View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetail
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onDelete={handleDeleteProblem}
          darkMode={darkMode}
        />
      )}

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <GoalDetail
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onDelete={handleDeleteGoal}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
