import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Survey from './pages/Survey'
import OpenSourceList from './pages/OpenSourceList'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/opensource-list" element={<OpenSourceList />} />
      </Routes>
  );
}

export default App
