import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import RoleLabel from "../../components/ui/RoleLabel";
import { Roles } from "../../const";

export default function EmployeesPage() {
  const users = useSelector((state: any) => state.data.users);

  const getRoleObject = (roleValue: string) => {
    return Roles.find(r => r.value === roleValue);
  };

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
                <tr key={user.id}>
                  <td>{user.firstName} {user.secondName}</td>
                  <td className="employee__roles">
                    {user.roles?.map((roleValue: any) => {
                      const roleObj = getRoleObject(roleValue);
                      return roleObj ? <RoleLabel key={roleValue} role={roleObj} /> : null;
                    })}
                  </td>
                  <td>הדרכות</td>
                  <td>{user.phoneNumber || '-'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
