// App.tsx

import { Route, Routes } from "react-router-dom";

import browserHistory from "./browser-history";
import { HistoryRouter } from "./components/HistoryRoute/HistoryRoute";

import { store } from "./store";
import { Provider } from "react-redux";

import { AppRoute } from "./const";

import EmployeesPage from "./pages/Employees/EmployeesPage";
import RequestsPage from "./pages/Requests/RequestsPage";
import NewEmployeePage from "./pages/NewEmployeePage/NewEmployeePage";
import NewProtocolPage from "./pages/NewProtocolPage/NewProtocolPage";
import Main from "./pages/Main/Main";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import AddShiftPage from "./pages/AddShiftPage/AddShiftPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export function App() {
  return (
    <HistoryRouter
      history={browserHistory}
      basename="/amishav-intel-haifa-admin"
    >
      <Provider store={store}>
        <Routes>

          {/* PUBLIC */}
          <Route
            path={AppRoute.Auth}
            element={<AuthPage />}
          />

          {/* PROTECTED */}
          <Route
            path={AppRoute.Root}
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />

          <Route
            path={AppRoute.Employees}
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AppRoute.Requests}
            element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AppRoute.NewEmployee}
            element={
              <ProtectedRoute>
                <NewEmployeePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AppRoute.NewProtocol}
            element={
              <ProtectedRoute>
                <NewProtocolPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AppRoute.AddShift}
            element={
              <ProtectedRoute>
                <AddShiftPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AppRoute.Schedule}
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Provider>
    </HistoryRouter>
  );
}
