import { Route, Routes } from "react-router-dom";
import browserHistory from "./browser-history";
import { HistoryRouter } from "./components/HistoryRoute/HistoryRoute";
import { store } from "./store";
import { Provider } from "react-redux";
import { AppRoute } from "./const";
import EmployeesPage from "./pages/Employees/EmployeesPage";
import RequestsPage from "./pages/Requests/RequestsPage";
import NewEmployeePage from "./pages/NewEmployeePage/NewEmployeePage";
import AddShiftPage from "./pages/AddShiftPage/AddShiftPage";
import NewProtocolPage from "./pages/NewProtocolPage/NewProtocolPage";
import Main from "./components/Main/Main";
import SchedulePage from "./pages/SchedulePage/SchedulePage";

export function App() {
  return (
    <HistoryRouter history={browserHistory} basename="/">
      <Provider store={store}>
        <Routes>
          <Route path={AppRoute.Root} element={<Main />} />
          <Route path={AppRoute.Employees} element={<EmployeesPage />} />
          <Route path={AppRoute.Requests} element={<RequestsPage />} />
          <Route path={AppRoute.NewEmployee} element={<NewEmployeePage />} />
          <Route path={AppRoute.NewProtocol} element={<NewProtocolPage />} />
          <Route path={AppRoute.AddShift} element={<AddShiftPage />} />
          <Route path={AppRoute.Schedule} element={<SchedulePage />} />

        </Routes>
      </Provider>
    </HistoryRouter>
  )
}
