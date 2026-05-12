'use client';

import { useState } from 'react';
import Link from 'next/link';

interface List {
  id: number;
  name: string;
  problemCount: number;
}

interface SidebarProps {
  lists: List[];
  selectedList: number | null;
  onSelectList: (listId: number | null) => void;
  onCreateList: () => void;
  darkMode: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function Sidebar({
  lists,
  selectedList,
  onSelectList,
  onCreateList,
  darkMode,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const [expandLists, setExpandLists] = useState(true);

  const bgClass = darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200';
  const textClass = darkMode ? 'text-slate-300' : 'text-slate-600';
  const activeClass = darkMode
    ? 'bg-cyan-500/20 border-l-2 border-cyan-500 text-cyan-400'
    : 'bg-cyan-100 border-l-2 border-cyan-600 text-cyan-600';

  return (
    <aside
      className={`${bgClass} ${collapsed ? 'w-16' : 'w-64'} h-screen border-r fixed left-0 top-0 overflow-y-auto pt-20 transition-all duration-300`}
    >
      <nav className={`py-6 space-y-2 ${collapsed ? 'px-2' : 'px-4'}`}>
        <button
          onClick={onToggleCollapsed}
          className={`flex items-center justify-center w-full rounded-lg transition ${
            darkMode
              ? 'hover:bg-slate-800/50 text-slate-300'
              : 'hover:bg-slate-100 text-slate-700'
          } ${collapsed ? 'px-2 py-3' : 'px-4 py-2'}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-lg">{collapsed ? '»' : '«'}</span>
        </button>

        {/* Repository Header */}
        <div className={`${collapsed ? 'px-2' : 'px-4'} py-2 mb-6`}>
          <h2 className={`text-xs font-semibold uppercase ${textClass} tracking-wider`}>
            {collapsed ? '📚' : '📚 DevTrack'}
          </h2>
        </div>

        {/* Lists Section */}
        <div>
          <button
            onClick={() => onSelectList(null)}
            className={`flex items-center gap-2 px-4 py-2 w-full rounded-lg transition mb-1 ${
              selectedList === null
                ? activeClass
                : darkMode
                ? 'hover:bg-slate-800/50 text-slate-300'
                : 'hover:bg-slate-100 text-slate-700'
            } ${collapsed ? 'justify-center px-2' : ''}`}
            title="All problems"
          >
            <span className="text-lg">📋</span>
            {!collapsed && <span className="text-sm font-semibold">All problems</span>}
          </button>

          <button
            onClick={() => setExpandLists(!expandLists)}
            className={`flex items-center gap-2 ${collapsed ? 'px-2 py-2 justify-center' : 'px-4 py-2'} w-full rounded-lg transition ${
              darkMode
                ? 'hover:bg-slate-800/50 text-slate-300'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <span className="text-lg">{expandLists ? '▼' : '▶'}</span>
            {!collapsed && <span className="text-sm font-semibold">Lists</span>}
            {!collapsed && <span className={`ml-auto text-xs ${textClass}`}>{lists.length}</span>}
          </button>

          {expandLists && !collapsed && (
            <div className="mt-2 space-y-1">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => onSelectList(list.id)}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition text-sm ${
                    selectedList === list.id
                      ? activeClass
                      : darkMode
                      ? 'hover:bg-slate-800/30 text-slate-400'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-lg">📁</span>
                  <span className="flex-1 text-left">{list.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-slate-700' : 'bg-slate-200'
                    }`}
                  >
                    {list.problemCount}
                  </span>
                </button>
              ))}

              <button
                onClick={onCreateList}
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition text-sm ${
                  darkMode
                    ? 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-300'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-600'
                }`}
              >
                <span className="text-lg">➕</span>
                <span>New List</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        {!collapsed && (
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="px-4 py-2 mb-3">
              <h3 className={`text-xs font-semibold uppercase ${textClass} tracking-wider`}>
                Quick Links
              </h3>
            </div>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                darkMode
                  ? 'hover:bg-slate-800/50 text-slate-400'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-lg">📊</span>
              <span className="text-sm">Dashboard</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
