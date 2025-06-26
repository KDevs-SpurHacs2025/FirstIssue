import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// 대표적인 언어/프레임워크/라이브러리 옵션
const languageOptions = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "C",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Scala",
  "Dart",
  "Elixir",
  "Perl",
  "R",
  "MATLAB",
  "HTML",
  "CSS",
  "Sass",
  "Less",
  "SQL",
  "GraphQL",
  "Shell",
  "Bash",
  "PowerShell",
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Remix",
  "Redux",
  "MobX",
  "Recoil",
  "Zustand",
  "Jest",
  "Testing Library",
  "Cypress",
  "Playwright",
  "Node.js",
  "Express",
  "NestJS",
  "Koa",
  "Fastify",
  "Spring",
  "Spring Boot",
  "Django",
  "Flask",
  "Rails",
  "Laravel",
  "ASP.NET",
  "Unity",
  "Unreal",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "OpenCV",
  "LangChain",
  "Hugging Face",
  "Firebase",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "Vercel",
  "Netlify",
  "Jenkins",
  "GitHub Actions",
  "Travis CI",
  "CircleCI",
  "Figma",
  "Storybook",
  "Three.js",
  "D3.js",
  "Chart.js",
  "Ant Design",
  "Material UI",
  "Tailwind CSS",
  "Bootstrap",
  "Chakra UI",
  "Emotion",
  "Styled Components",
  "Webpack",
  "Vite",
  "Rollup",
  "Parcel",
  "Babel",
  "ESLint",
  "Prettier",
  "Yarn",
  "npm",
  "pnpm",
];

interface AutocompleteTagsInputProps {
  value: string[];
  onChange: (newValue: string[]) => void;
  label?: string;
  placeholder?: string;
}

const AutocompleteTagsInput: React.FC<AutocompleteTagsInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "Type or select...",
}) => {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={languageOptions}
      value={value}
      onChange={(_, newValue) => {
        // newValue: (string | any)[]
        // string만 추출
        onChange(newValue.map((v) => (typeof v === "string" ? v : String(v))));
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <span
            key={option}
            {...getTagProps({ index })}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#4b5563", // Tailwind bg-gray-600
              color: "#fff",
              borderRadius: 8,
              padding: "4px 10px",
              margin: 2,
              fontSize: 13,
            }}
          >
            {option}
          </span>
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          sx={{
            background: "#0f172a",
            borderRadius: 2,
            input: { color: "#fff" },
            label: { color: "#fff" },
          }}
        />
      )}
      sx={{ width: "100%", mt: 2 }}
    />
  );
};

export default AutocompleteTagsInput;
