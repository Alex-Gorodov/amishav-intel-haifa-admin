import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useMemo, useState } from "react";
import CreateEmployeeForm from "../../components/CreateEmployeeForm/CreateEmployeeForm";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { useDarkTheme } from "../../hooks/useDarkThemeContext";
import { normalizeDate } from "../../utils/dateUtils";

export default function EmployeesPage() {
  const users = useSelector((state: RootState) => state.data.users);

  const sortedUsers = useMemo(() => {
    return [...users].sort(
      (a, b) =>
        normalizeDate(a.createdAt).getTime() -
        normalizeDate(b.createdAt).getTime()
    );
  }, [users]);

  const { isDark } = useDarkTheme();

  const [isFormOpened, setFormOpened] = useState(false);
  const [search, setSearch] = useState('')

  const filteredUsers = sortedUsers.filter((u) => u.firstName.includes(search) || u.secondName.includes(search));

  return (
    <Layout>
      <div className={`${isDark ? 'page--dark' : ''}`}>

        <div className="page__header page__header--employees">
          <input
            className="form__list-item form__input form__list-item--search-user page__search-line"
            type="search"
            id="user"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="הכנס שם עובד..."
            autoFocus={!isTouchDevice()}
          />
          <button className="button button--add button--wide" onClick={() => setFormOpened(true)}>
            <span>הוסף עובד חדש</span>
          </button>
        </div>

        <table className="page__content employees-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>תפקידים</th>
              <th>הדרכות</th>
              <th>מסמכים</th>
              <th>טלפון</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredUsers?.map((user: any) => (
                <EmployeeItem key={user.id} user={user} />
              ))
            }
          </tbody>
        </table>
      </div>

      {
        isFormOpened
        &&
        <CreateEmployeeForm onClose={() => setFormOpened(false)}/>
      }
    </Layout>
  );
}
