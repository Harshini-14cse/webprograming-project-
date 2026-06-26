import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import UploadPDF from './pages/UploadPDF'
import Summary from './pages/Summary'
import ConceptExplainer from './pages/ConceptExplainer'
import MCQGenerator from './pages/MCQGenerator'
import QuizMode from './pages/QuizMode'
import Questions2Mark from './pages/Questions2Mark'
import Questions13Mark from './pages/Questions13Mark'
import DoubtSolver from './pages/DoubtSolver'
import Timetable from './pages/Timetable'
import ProgressTracker from './pages/ProgressTracker'
import ExportNotes from './pages/ExportNotes'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
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
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
