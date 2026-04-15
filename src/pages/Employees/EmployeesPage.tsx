import { useSelector } from "react-redux";
import EmployeeItem from "../../components/EmployeeItem/EmployeeItem";
import Layout from "../../components/Layout/Layout";

export default function EmployeesPage() {
  const users = useSelector((state: any) => state.data.users);

  return (
    <Layout>
      <div className="page page--employees">
        <h1 className="page__title">רשימת עובדים</h1>
        <div className="employees-list">
          {
            users?.map((user: any) => (
              <EmployeeItem key={user.id} user={user} />
            ))
          }
        </div>
      </div>
    </Layout>
  );
}
