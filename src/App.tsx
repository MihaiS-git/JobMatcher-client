import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      }
    ],
  }
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
