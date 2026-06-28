import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Dashboard from '@/pages/Dashboard'
import UploadPDF from '@/pages/UploadPDF'
import Summary from '@/pages/Summary'
import ConceptExplainer from '@/pages/ConceptExplainer'
import MCQGenerator from '@/pages/MCQGenerator'
import QuizMode from '@/pages/QuizMode'
import Questions2Mark from '@/pages/Questions2Mark'
import Questions13Mark from '@/pages/Questions13Mark'
import DoubtSolver from '@/pages/DoubtSolver'
import Timetable from '@/pages/Timetable'
import ProgressTracker from '@/pages/ProgressTracker'
import ExportNotes from '@/pages/ExportNotes'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPDF />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/concepts" element={<ConceptExplainer />} />
          <Route path="/mcq" element={<MCQGenerator />} />
          <Route path="/quiz" element={<QuizMode />} />
          <Route path="/2mark" element={<Questions2Mark />} />
          <Route path="/13mark" element={<Questions13Mark />} />
          <Route path="/doubt" element={<DoubtSolver />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/export" element={<ExportNotes />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
              <AnimatedRoutes />
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
