import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";
import { useSelector } from "react-redux";



export default function EmployeesPage() {
  const users = useSelector((state: any) => state.data.users);

  return (
    <Layout>
      <div className="page page--employees">
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
