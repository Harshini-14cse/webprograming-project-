import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Upload, FileText, Lightbulb, HelpCircle,
  BookOpen, AlignLeft, AlignJustify, Clock, BarChart3, Download, X
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload PDF' },
  { to: '/summary', icon: FileText, label: 'AI Summary' },
  { to: '/concepts', icon: Lightbulb, label: 'Concept Explainer' },
  { to: '/mcq', icon: HelpCircle, label: 'MCQ Generator' },
  { to: '/quiz', icon: BookOpen, label: 'Quiz Mode' },
  { to: '/2mark', icon: AlignLeft, label: '2-Mark Questions' },
  { to: '/13mark', icon: AlignJustify, label: '13-Mark Questions' },
  { to: '/doubt', icon: HelpCircle, label: 'Doubt Solver' },
  { to: '/timetable', icon: Clock, label: 'Study Timetable' },
  { to: '/progress', icon: BarChart3, label: 'Progress Tracker' },
  { to: '/export', icon: Download, label: 'Export Notes' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-400" size={24} />
            <span className="font-bold text-lg">LearnBuddy AI</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-800 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-300'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          Powered by Groq AI
        </div>
      </aside>
    </>
  )
}
