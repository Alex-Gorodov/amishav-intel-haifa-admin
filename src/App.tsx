import { Route, Routes } from "react-router-dom";
import browserHistory from "./browser-history";
import { HistoryRouter } from "./components/HistoryRoute/HistoryRoute";
import { store } from "./store";
import { Provider } from "react-redux";
import Main from "./components/Main/Main";
import { AppRoute } from "./const";
import EmployeesPage from "./pages/Employees/EmployeesPage";

export function App() {
  return (
    <HistoryRouter history={browserHistory} basename="/">
      <Provider store={store}>
        <Routes>
          <Route path={AppRoute.Root} element={<Main />} />
          <Route path={AppRoute.Employees} element={<EmployeesPage />} />
        </Routes>
      </Provider>
    </HistoryRouter>
  )
}
