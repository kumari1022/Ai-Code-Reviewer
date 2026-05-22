import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  localStorage.setItem("token", "demo");

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;