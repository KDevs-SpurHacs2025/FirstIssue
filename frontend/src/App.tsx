import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Survey from './pages/Survey'
import OpenSourceList from './pages/OpenSourceList'
import OpenSourceDetail from './pages/OpenSourceDetail'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/opensource-list" element={<OpenSourceList />} />
        <Route path="/opensource-detail" element={<OpenSourceDetail />} />
      </Routes>
  );
}

export default App
