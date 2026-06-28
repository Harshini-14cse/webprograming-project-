import {
  LayoutDashboard,
  Upload,
  FileText,
  Lightbulb,
  ListChecks,
  GraduationCap,
  PenLine,
  ScrollText,
  MessageCircleQuestion,
  CalendarClock,
  BarChart3,
  Download,
} from 'lucide-react'

/**
 * Single source of truth for navigation + feature metadata.
 * Used by the Sidebar and the Dashboard feature grid.
 */
export const navSections = [
  {
    label: 'Overview',
    items: [
      {
        to: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Your study hub at a glance',
        accent: 'brand',
      },
    ],
  },
  {
    label: 'Library',
    items: [
      {
        to: '/upload',
        label: 'Upload PDF',
        icon: Upload,
        description: 'Add study material as context',
        accent: 'sky',
      },
    ],
  },
  {
    label: 'Study Tools',
    items: [
      {
        to: '/summary',
        label: 'AI Summary',
        icon: FileText,
        description: 'Condense notes into key points',
        accent: 'emerald',
      },
      {
        to: '/concepts',
        label: 'Concept Explainer',
        icon: Lightbulb,
        description: 'Break down any topic clearly',
        accent: 'amber',
      },
      {
        to: '/mcq',
        label: 'MCQ Generator',
        icon: ListChecks,
        description: 'Practice multiple-choice questions',
        accent: 'violet',
      },
      {
        to: '/quiz',
        label: 'Quiz Mode',
        icon: GraduationCap,
        description: 'Test yourself, get scored',
        accent: 'indigo',
      },
      {
        to: '/2mark',
        label: '2-Mark Questions',
        icon: PenLine,
        description: 'Short-answer exam prep',
        accent: 'pink',
      },
      {
        to: '/13mark',
        label: '13-Mark Questions',
        icon: ScrollText,
        description: 'Long-answer model answers',
        accent: 'orange',
      },
    ],
  },
  {
    label: 'Assistant',
    items: [
      {
        to: '/doubt',
        label: 'Doubt Solver',
        icon: MessageCircleQuestion,
        description: 'Chat through any question',
        accent: 'teal',
      },
    ],
  },
  {
    label: 'Plan & Track',
    items: [
      {
        to: '/timetable',
        label: 'Study Timetable',
        icon: CalendarClock,
        description: 'Build a smart study plan',
        accent: 'cyan',
      },
      {
        to: '/progress',
        label: 'Progress Tracker',
        icon: BarChart3,
        description: 'Visualize your learning',
        accent: 'lime',
      },
    ],
  },
  {
    label: 'Export',
    items: [
      {
        to: '/export',
        label: 'Export Notes',
        icon: Download,
        description: 'Download notes as a PDF',
        accent: 'rose',
      },
    ],
  },
]

export const allNavItems = navSections.flatMap((s) => s.items)

/** Tailwind classes per accent — used by dashboard feature cards. */
export const accentClasses = {
  brand: 'bg-brand-50 text-brand-600',
  sky: 'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  pink: 'bg-pink-50 text-pink-600',
  orange: 'bg-orange-50 text-orange-600',
  teal: 'bg-teal-50 text-teal-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  lime: 'bg-lime-50 text-lime-600',
  rose: 'bg-rose-50 text-rose-600',
}
