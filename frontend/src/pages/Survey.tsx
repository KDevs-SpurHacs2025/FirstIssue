import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Survey = () => {
  // State for checkboxes and inputs
  const [whyContribute, setWhyContribute] = useState('');
  const [howContribute, setHowContribute] = useState<string[]>([]);
  const [proudProject, setProudProject] = useState('');
  const [proudProjectType, setProudProjectType] = useState('');
  const [confidentLangs, setConfidentLangs] = useState<string[]>([]);
  const [enjoyLangs, setEnjoyLangs] = useState<string[]>([]);
  const [learnLangs, setLearnLangs] = useState<string[]>([]);
  const [contribCount, setContribCount] = useState('');
  const [pastLinks, setPastLinks] = useState(['']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Options
  const whyOptions = [
    "I want to contribute using the languages or frameworks I'm confident in.",
    "I want to learn new programming languages or frameworks through contribution.",
    "I want to contribute to a specific open-source project I like"
  ];
  const howOptions = [
    "Code contributions (bug fixes, refactoring, performance improvements, writing test code)",
    "Documentation (fixing typos, improving grammar, writing API docs, adding tutorials or guides)",
    "Design & UI/UX (logos, icons, visual assets)",
    "Testing & Reviewing (reviewing PRs, testing projects, giving feedback)"
  ];
  const contribCountOptions = [
    'Never',
    '1–2 times',
    '3–5 times',
    'More than 5 times'
  ];
  const proudProjectTypeOptions = [
    'Web App',
    'Mobile App',
    'Desktop App',
    'Library',
    'CLI Tool',
    'API/Backend',
    'Other'
  ];

  // Handlers
  const handleCheckbox = (value: string, group: string[], setGroup: React.Dispatch<React.SetStateAction<string[]>>) => {
    setGroup(group.includes(value) ? group.filter(v => v !== value) : [...group, value]);
  };
  const handleMultiInput = (index: number, value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>, arr: string[]) => {
    const newArr = [...arr];
    newArr[index] = value;
    setFn(newArr);
  };
  const addPastLink = () => setPastLinks([...pastLinks, '']);
  const removePastLink = (idx: number) => setPastLinks(pastLinks.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/opensource-list');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Help Us Find Your Perfect Open Source Match</h1>
      <p className="mb-6">Answer a few questions to get personalized repository recommendations</p>
      {/* 1. Why do you want to contribute? */}
      <div className="mb-6">
        <label className="font-semibold">1. Why do you want to contribute to open source?</label>
        <div className="flex flex-col gap-2 mt-2">
          {whyOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input type="radio" name="whyContribute" value={option} checked={whyContribute === option} onChange={() => setWhyContribute(option)} />
              {option}
            </label>
          ))}
        </div>
      </div>
      {/* 2. How do you want to contribute? */}
      <div className="mb-6">
        <label className="font-semibold">2. How do you want to contribute? (Select all that apply.)</label>
        <div className="flex flex-col gap-2 mt-2">
          {howOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input type="checkbox" checked={howContribute.includes(option)} onChange={() => handleCheckbox(option, howContribute, setHowContribute)} />
              {option}
            </label>
          ))}
        </div>
      </div>
      {/* 3. Proudest project */}
      <div className="mb-6">
        <label className="font-semibold">3. Tell us about your proudest project or your representative public repo. (Optional)</label>
        <div className="flex flex-row gap-2 mt-2">
          <select className="p-2 border rounded" value={proudProjectType} onChange={e => setProudProjectType(e.target.value)}>
            <option value="">Type</option>
            {proudProjectTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <input type="text" className="flex-1 p-2 border rounded" placeholder="Paste GitHub URL(s)" value={proudProject} onChange={e => setProudProject(e.target.value)} />
        </div>
      </div>
      {/* 4. Confident in */}
      <div className="mb-6">
        <label className="font-semibold">4. Languages or frameworks you’re confident in:</label>
        <input type="text" className="w-full mt-2 p-2 border rounded" placeholder="e.g. JavaScript, React, Python" value={confidentLangs.join(', ')} onChange={e => setConfidentLangs(e.target.value.split(','))} />
      </div>
      {/* 5. Enjoy using */}
      <div className="mb-6">
        <label className="font-semibold">5. Languages or frameworks you enjoy using:</label>
        <input type="text" className="w-full mt-2 p-2 border rounded" placeholder="e.g. TypeScript, Vue, Go" value={enjoyLangs.join(', ')} onChange={e => setEnjoyLangs(e.target.value.split(','))} />
      </div>
      {/* 6. Want to learn */}
      <div className="mb-6">
        <label className="font-semibold">6. Languages or frameworks you want to learn:</label>
        <input type="text" className="w-full mt-2 p-2 border rounded" placeholder="e.g. Rust, Svelte, Elixir" value={learnLangs.join(', ')} onChange={e => setLearnLangs(e.target.value.split(','))} />
      </div>
      {/* 7. Contribution count */}
      <div className="mb-6">
        <label className="font-semibold">7. How many times have you contributed to open source?</label>
        <select className="w-full mt-2 p-2 border rounded" value={contribCount} onChange={e => setContribCount(e.target.value)}>
          <option value="">Select...</option>
          {contribCountOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {/* 8. Past contributions */}
      <div className="mb-6">
        <label className="font-semibold">8. If you’ve contributed to open source before, please share links to your past contributions. (Optional — up to 5 links)</label>
        {pastLinks.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2 mt-2">
            <input type="url" className="w-full p-2 border rounded" placeholder="Paste URL" value={link} onChange={e => handleMultiInput(idx, e.target.value, setPastLinks, pastLinks)} />
            {pastLinks.length > 1 && <button type="button" className="text-red-500" onClick={() => removePastLink(idx)}>❌</button>}
          </div>
        ))}
        {pastLinks.length < 5 && <button type="button" className="mt-2 text-blue-600" onClick={addPastLink}>Add another link ➕</button>}
      </div>
      <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">Submit</button>
    </form>
  )
}


export default Survey;
