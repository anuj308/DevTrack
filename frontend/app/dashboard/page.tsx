'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { goalsApi, listsApi, problemsApi } from '@/lib/api';
import Sidebar from '../../components/Sidebar';
import ProblemDetail from '../../components/ProblemDetail';
import GoalDetail from '../../components/GoalDetail';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  link?: string;
  notes?: string;
  listId?: number;
  listName?: string;
  solvedAt?: string;
}

interface Goal {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
  listName?: string;
}

interface ListItem {
  id: number;
  name: string;
  problemCount: number;
}

const DIFFICULTY_BADGES: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Hard: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

function normalizeListName(name: string) {
  return name.trim().toLowerCase();
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Redirect to home if session is unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/');
    }
  }, [status]);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'goals'>('problems');
  const [selectedList, setSelectedList] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [problemListQuery, setProblemListQuery] = useState('');
  const [problemListDropdownOpen, setProblemListDropdownOpen] = useState(false);
  const [initializedSelection, setInitializedSelection] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsData, problemsData, goalsData] = await Promise.all([
          listsApi.getAll(),
          problemsApi.getAll(),
          goalsApi.getAll(),
        ]);

        const normalizedLists = Array.isArray(listsData) ? listsData : [];
        const resolvedProblems = Array.isArray(problemsData) ? problemsData : [];
        const resolvedGoals = Array.isArray(goalsData) ? goalsData : [];

        const counts: Record<number, number> = {};
        resolvedProblems.forEach((problem: Problem) => {
          const listId = problem.listId || normalizedLists[0]?.id || 1;
          counts[listId] = (counts[listId] || 0) + 1;
        });

        setLists(
          normalizedLists.map((list: any) => ({
            id: list.id,
            name: list.name,
            problemCount: counts[list.id] || 0,
          }))
        );
        setProblems(resolvedProblems);
        setGoals(resolvedGoals);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  useEffect(() => {
    if (!initializedSelection && lists.length > 0) {
      setSelectedList(lists[0].id);
      setProblemListQuery(lists[0].name);
      setInitializedSelection(true);
    }
  }, [initializedSelection, lists]);

  const listLookup = useMemo(() => {
    return new Map(lists.map((list) => [list.id, list.name]));
  }, [lists]);

  const enrichedProblems = useMemo(
    () =>
      problems.map((problem) => ({
        ...problem,
        listName: problem.listId ? listLookup.get(problem.listId) || 'Default' : 'Default',
      })),
    [listLookup, problems]
  );

  const visibleProblems = useMemo(() => {
    if (!selectedList) {
      return enrichedProblems;
    }

    return enrichedProblems.filter((problem) => (problem.listId || lists[0]?.id) === selectedList);
  }, [enrichedProblems, lists, selectedList]);

  const filteredListSuggestions = useMemo(() => {
    const query = problemListQuery.trim().toLowerCase();
    if (!query) {
      return lists;
    }

    return lists.filter((list) => list.name.toLowerCase().includes(query));
  }, [lists, problemListQuery]);

  const exactListMatch = useMemo(() => {
    const query = normalizeListName(problemListQuery);
    if (!query) {
      return null;
    }

    return lists.find((list) => normalizeListName(list.name) === query) || null;
  }, [lists, problemListQuery]);

  const currentListLabel =
    selectedList && listLookup.get(selectedList) ? listLookup.get(selectedList) : 'All problems';

  const bgClass = darkMode ? 'bg-slate-950' : 'bg-slate-50';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const panelClass = darkMode
    ? 'bg-slate-900/70 border-slate-800 shadow-black/20'
    : 'bg-white border-slate-200 shadow-slate-200/40';
  const inputClass = darkMode
    ? 'bg-slate-950/60 border-slate-700 text-white placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500';

  const sidebarWidthClass = sidebarCollapsed ? 'ml-16' : 'ml-64';

  const refreshCounts = (updatedLists: ListItem[], updatedProblems: Problem[]) => {
    const counts: Record<number, number> = {};
    updatedProblems.forEach((problem) => {
      const listId = problem.listId || updatedLists[0]?.id || 1;
      counts[listId] = (counts[listId] || 0) + 1;
    });

    return updatedLists.map((list) => ({
      ...list,
      problemCount: counts[list.id] || 0,
    }));
  };

  const createListFromName = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return null;
    }

    const existing = lists.find((list) => normalizeListName(list.name) === normalizeListName(trimmed));
    if (existing) {
      return existing;
    }

    const created = await listsApi.create({ name: trimmed });
    const normalizedCreated = {
      id: created.id,
      name: created.name,
      problemCount: 0,
    } as ListItem;

    setLists((current) => refreshCounts([...current, normalizedCreated], problems));
    return normalizedCreated;
  };

  const handleManualListCreate = async () => {
    const created = await createListFromName(newListName);
    if (!created) {
      return;
    }

    setNewListName('');
    setShowListForm(false);
    setSelectedList(created.id);
    setProblemListQuery(created.name);
  };

  const handleAddProblem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const difficulty = String(formData.get('difficulty') || 'Easy');
    const link = String(formData.get('link') || '').trim();
    const notes = String(formData.get('notes') || '').trim();
    const query = problemListQuery.trim();

    let targetList = exactListMatch || lists.find((list) => list.id === selectedList) || null;

    if (query && !targetList) {
      const shouldCreate = window.confirm(`List "${query}" does not exist. Create it now?`);
      if (!shouldCreate) {
        return;
      }
      targetList = await createListFromName(query);
    }

    if (!targetList) {
      const fallbackList = lists[0];
      if (!fallbackList) {
        alert('Create a list first before adding a problem.');
        return;
      }
      targetList = fallbackList;
    }

    try {
      const createdProblem = await problemsApi.create({
        title,
        difficulty,
        link: link || undefined,
        notes: notes || undefined,
        listId: targetList.id,
      });

      const nextProblems = [...problems, createdProblem];
      setProblems(nextProblems);
      setLists((current) => refreshCounts(current, nextProblems));
      setSelectedList(targetList.id);
      setProblemListQuery(targetList.name);
      // Reset form before closing to avoid null reference
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
      setShowProblemForm(false);
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const handleAddGoal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const createdGoal = await goalsApi.create({
        title: String(formData.get('title') || '').trim(),
        dueDate: String(formData.get('dueDate') || ''),
      });
      setGoals((current) => [...current, createdGoal]);
      setShowGoalForm(false);
      // Reset form if it exists
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDeleteProblem = async (id: number) => {
    try {
      await problemsApi.delete(id);
      const nextProblems = problems.filter((problem) => problem.id !== id);
      setProblems(nextProblems);
      setLists((current) => refreshCounts(current, nextProblems));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await goalsApi.delete(id);
      setGoals((current) => current.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleToggleGoalComplete = async (goalId: number, completed: boolean) => {
    try {
      const updatedGoal = await goalsApi.updateCompletion(goalId, completed);
      setGoals((current) => current.map((goal) => (goal.id === goalId ? updatedGoal : goal)));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
    } catch (error) {
      console.error('Error updating goal completion:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen ${bgClass} ${textClass} flex items-center justify-center`}>
        <div className="text-lg font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur ${
          darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/85 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className={`text-xs uppercase tracking-[0.3em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              DevTrack
            </p>
            <h1 className={`text-2xl font-semibold ${textClass}`}>Problem dashboard</h1>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentListLabel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode((current) => !current)}
              className={`rounded-full px-3 py-2 text-sm transition ${
                darkMode
                  ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={() => signOut()}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <Sidebar
        lists={lists}
        selectedList={selectedList}
        onSelectList={(listId) => {
          setSelectedList(listId);
          setProblemListQuery(listId ? listLookup.get(listId) || '' : '');
        }}
        onCreateList={() => setShowListForm(true)}
        darkMode={darkMode}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
      />

        <main className={`px-4 py-8 pt-32 ${sidebarWidthClass}`}>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('problems')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === 'problems'
                ? 'bg-cyan-500 text-slate-950'
                : darkMode
                ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === 'goals'
                ? 'bg-cyan-500 text-slate-950'
                : darkMode
                ? 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Goals
          </button>
          <span className={`ml-auto text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {visibleProblems.length} problems in view
          </span>
        </div>

        {showListForm && (
          <div className={`${panelClass} mb-6 rounded-3xl border p-5`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <label className={`mb-2 block text-sm font-medium ${textClass}`}>Create list</label>
                <input
                  value={newListName}
                  onChange={(event) => setNewListName(event.target.value)}
                  placeholder="Enter list name"
                  className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleManualListCreate}
                  className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  Create list
                </button>
                <button
                  onClick={() => setShowListForm(false)}
                  className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                    darkMode
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <section className="space-y-6">
            {showProblemForm && (
              <div className={`${panelClass} rounded-3xl border p-6`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className={`text-xl font-semibold ${textClass}`}>Add problem</h2>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Search a list, select one, or create it inline.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProblemForm(false)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      darkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Close
                  </button>
                </div>

                <form className="space-y-5" onSubmit={handleAddProblem}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${textClass}`}>Title</label>
                      <input
                        name="title"
                        required
                        placeholder="Two Sum"
                        className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${textClass}`}>Difficulty</label>
                      <select
                        name="difficulty"
                        className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                      <div>
                      <label className={`mb-2 block text-sm font-medium ${textClass}`}>Problem URL</label>
                      <input
                        name="link"
                        type="url"
                        placeholder="https://leetcode.com/problems/..."
                        className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`mb-2 block text-sm font-medium ${textClass}`}>Notes</label>
                    <textarea
                      name="notes"
                      rows={4}
                      placeholder="Write brute force idea, edge cases, or templates..."
                      className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                    />
                  </div>

                  <div className="relative">
                    <label className={`mb-2 block text-sm font-medium ${textClass}`}>List</label>
                    <input
                      value={problemListQuery}
                      onChange={(event) => {
                        setProblemListQuery(event.target.value);
                        setSelectedList(null);
                        setProblemListDropdownOpen(true);
                      }}
                      onFocus={() => setProblemListDropdownOpen(true)}
                      placeholder="Search or create list"
                      className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                    />
                    {problemListDropdownOpen && (
                      <div className={`absolute z-20 mt-2 w-full rounded-2xl border ${panelClass}`}>
                        <div className="max-h-60 overflow-y-auto p-2">
                          {filteredListSuggestions.length > 0 ? (
                            filteredListSuggestions.map((list) => (
                              <button
                                key={list.id}
                                type="button"
                                onClick={() => {
                                  setSelectedList(list.id);
                                  setProblemListQuery(list.name);
                                  setProblemListDropdownOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                                  darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                                }`}
                              >
                                <span>{list.name}</span>
                                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {list.problemCount} problems
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className={`px-4 py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              No list found.
                            </div>
                          )}

                          {problemListQuery.trim() && !exactListMatch && (
                            <button
                              type="button"
                              onClick={async () => {
                                const created = await createListFromName(problemListQuery);
                                if (created) {
                                  setSelectedList(created.id);
                                  setProblemListDropdownOpen(false);
                                }
                              }}
                              className="mt-2 w-full rounded-xl bg-cyan-500 px-4 py-3 text-left text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                            >
                              + Create "{problemListQuery.trim()}"
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    <p className={`mt-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      If the list does not exist, you will be asked to create it before saving.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Save problem
                    </button>
                    <button
                      type="button"
                      onClick={() => setProblemListDropdownOpen(false)}
                      className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                        darkMode
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Close list picker
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {visibleProblems.length === 0 ? (
                <div className={`${panelClass} rounded-3xl border p-10 text-center`}>
                  <p className={`text-lg ${textClass}`}>No problems in this list yet.</p>
                  <button
                    onClick={() => setShowProblemForm(true)}
                    className="mt-4 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Add your first problem
                  </button>
                </div>
              ) : (
                visibleProblems.map((problem) => (
                  <article
                    key={problem.id}
                    className={`${panelClass} rounded-3xl border px-5 py-4 transition hover:-translate-y-0.5 hover:border-cyan-500/40`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => setSelectedProblem(problem)}
                            className={`text-left text-lg font-semibold ${textClass} hover:text-cyan-400`}
                          >
                            {problem.title}
                          </button>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              DIFFICULTY_BADGES[problem.difficulty] || DIFFICULTY_BADGES.Easy
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            {problem.listName || 'Default'}
                          </span>
                        </div>
                        <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {problem.topics || 'No topics added'}
                        </p>
                        {problem.notes && (
                          <p className={`mt-2 line-clamp-2 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                            {problem.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        {problem.link ? (
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                          >
                            Solve
                          </a>
                        ) : null}
                        <button
                          onClick={() => setSelectedProblem(problem)}
                          className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                            darkMode
                              ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'goals' && (
          <section className="space-y-6">
            {showGoalForm && (
              <div className={`${panelClass} rounded-3xl border p-6`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className={`text-xl font-semibold ${textClass}`}>Add goal</h2>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Track goals as a simple list.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGoalForm(false)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      darkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Close
                  </button>
                </div>

                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAddGoal}>
                  <div className="md:col-span-2">
                    <label className={`mb-2 block text-sm font-medium ${textClass}`}>Title</label>
                    <input
                      name="title"
                      required
                      placeholder="Finish dynamic programming revision"
                      className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-medium ${textClass}`}>Due date</label>
                    <input
                      name="dueDate"
                      type="date"
                      required
                      className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                    />
                  </div>
                  <div className="flex items-end gap-3 md:justify-end">
                    <button
                      type="submit"
                      className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Save goal
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {goals.length === 0 ? (
                <div className={`${panelClass} rounded-3xl border p-10 text-center`}>
                  <p className={`text-lg ${textClass}`}>No goals yet.</p>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="mt-4 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Add your first goal
                  </button>
                </div>
              ) : (
                goals.map((goal) => (
                  <article
                    key={goal.id}
                    className={`${panelClass} rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5 hover:border-cyan-500/40 ${
                      goal.completed ? 'border-emerald-500/40 bg-emerald-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => setSelectedGoal(goal)}
                          className={`text-left text-base font-semibold ${textClass} hover:text-cyan-400 line-clamp-1`}
                        >
                          {goal.title}
                        </button>
                        <div className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>Due {new Date(goal.dueDate).toLocaleDateString()}</span>
                          {goal.completed && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-300">Completed</span>}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                          goal.completed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/15 text-sky-300'
                        }`}
                      >
                        {goal.completed ? 'Completed' : 'Active'}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedGoal(goal)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                          darkMode
                            ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleToggleGoalComplete(goal.id, !goal.completed)}
                        className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                          goal.completed
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                        }`}
                      >
                        {goal.completed ? 'Done' : 'Mark done'}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {selectedProblem && (
        <ProblemDetail
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onDelete={handleDeleteProblem}
          darkMode={darkMode}
        />
      )}

      {selectedGoal && (
        <GoalDetail
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onDelete={handleDeleteGoal}
          onToggleComplete={handleToggleGoalComplete}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
