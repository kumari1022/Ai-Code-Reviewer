import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ReviewPage from "./pages/ReviewPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryPage from "./pages/HistoryPage";
import DetailedReviewPage from "./pages/DetailedReviewPage";
import ChatPage from "./pages/ChatPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={<DetailedReviewPage />}
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={<HistoryPage />}
        />
        <Route
          path="/chat"
          element={<ChatPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;