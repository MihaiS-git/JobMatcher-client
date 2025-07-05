import { useEffect } from "react";
import "./App.css";

function App() {
  function toggleTheme() {
    console.log("Clicked");

    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

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

          <button
            onClick={toggleTheme}
            className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
          >
            Toggle Theme
          </button>
        </main>
      </div>
  );
}

export default App;
