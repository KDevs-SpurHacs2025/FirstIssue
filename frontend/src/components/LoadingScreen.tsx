import LinearProgress from '@mui/material/LinearProgress';

interface LoadingScreenProps {
  title?: string;
}

const LoadingScreen = ({
  title
}: LoadingScreenProps) => (
  <div className="flex items-center justify-center h-screen w-screen bg-bg-black">
    <div className="text-center w-full max-w-xs">
      <p className="text-xl font-semibold text-white mb-1">{title}</p>
      <LinearProgress color="primary" className="mt-4" />
    </div>
  </div>
);

export default LoadingScreen;