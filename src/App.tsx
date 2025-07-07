import "./App.css";
import ThemeToggleButton from "./components/ThemeToggleButton";

function App() {
  return (
    <div className="bg-white text-slate-900 dark:bg-gray-900 dark:text-slate-100 min-h-screen font-roboto">
      <header className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-xl font-bold">Freelancer Connect</h1>
      </header>

      <main className="p-4">
        <button className="bg-blue-600 text-white dark:bg-blue-500 dark:text-white px-4 py-2 rounded">
          Post a Job
        </button>

        <button className="ml-4 bg-indigo-500 text-white dark:bg-indigo-400 dark:text-gray-900 px-4 py-2 rounded">
          Hire a Freelancer
        </button>

        <ThemeToggleButton />
      </main>
    </div>
  );
}

export default App;
