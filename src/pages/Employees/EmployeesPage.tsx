import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect, useState } from "react";
import CreateEmployeeForm from "../../components/CreateEmployeeForm/CreateEmployeeForm";
import { getShiftsStreak } from "../../utils/getShiftsStreak";



export default function EmployeesPage() {
  const users = useSelector((state: RootState) => state.data.users);
  const [isFormOpened, setFormOpened] = useState(false);

  useEffect(() => {
    console.log(
      users.forEach((u) => `${u.secondName}'s shifts streak: ${getShiftsStreak(u)}`)
    )
  }, [users])

  return (
    <Layout>
      <div className="page__header">
        <h1 className="page__title">רשימת עובדים</h1>
        <button className="button button--header" onClick={() => setFormOpened(true)}>+</button>
      </div>

      <table className="page__content employees-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>תפקידים</th>
            <th>הדרכות</th>
            <th>טלפון</th>
          </tr>
        </thead>
        <tbody>
          {
            users?.map((user: any) => (
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
