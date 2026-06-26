import { Menu, BookOpen } from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 lg:hidden sticky top-0 z-10">
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900">
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-2">
        <BookOpen className="text-blue-600" size={20} />
        <span className="font-bold text-gray-900">LearnBuddy AI</span>
      </div>
    </header>
  )
}
