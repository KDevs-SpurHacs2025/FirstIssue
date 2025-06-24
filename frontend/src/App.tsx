import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Survey from './pages/Survey'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
      </Routes>
  );
}

export default App
