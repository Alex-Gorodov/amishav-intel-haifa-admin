import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";



export default function EmployeesPage() {
  const users = useSelector((state: RootState) => state.data.users);

  return (
    <Layout>
      <div className="page">
        <h1 className="page__title">רשימת עובדים</h1>

        <table className="employees-table">
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
      </div>
    </Layout>
  );
}
