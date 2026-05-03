import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect, useState } from "react";
import CreateEmployeeForm from "../../components/CreateEmployeeForm/CreateEmployeeForm";
import { getShiftsStreak } from "../../utils/getShiftsStreak";
import { isTouchDevice } from "../../utils/isTouchDevice";

export default function EmployeesPage() {
  const users = useSelector((state: RootState) => state.data.users);
  const [isFormOpened, setFormOpened] = useState(false);
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter((u) => u.firstName.includes(search) || u.secondName.includes(search));

  return (
    <Layout>
      <div className="page__header page__header--employees">
        <input
          className="form__list-item form__list-item--search-user"
          type="search"
          id="user"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="הכנס שם עובד..."
          autoFocus={!isTouchDevice()}
        />
        <button className="button button--header button--wide" onClick={() => setFormOpened(true)}>
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

      {
        isFormOpened
        &&
        <CreateEmployeeForm onClose={() => setFormOpened(false)}/>
      }
    </Layout>
  );
}
