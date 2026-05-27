import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Quiz } from './pages/Quiz'
import { Wizard, MilestonesIndex } from './pages/Wizard'
import { Resume } from './pages/Resume'
import { PromptDeploy } from './pages/PromptDeploy'
import { Cheatsheet } from './pages/Cheatsheet'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/wizard" element={<MilestonesIndex />} />
        <Route path="/wizard/:milestoneId" element={<Wizard />} />
        <Route path="/wizard/:milestoneId/:stepId" element={<Wizard />} />
        <Route path="/prompt" element={<PromptDeploy />} />
        <Route path="/cheatsheet" element={<Cheatsheet />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}
