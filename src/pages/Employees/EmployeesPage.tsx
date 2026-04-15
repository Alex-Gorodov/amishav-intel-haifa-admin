import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import RoleLabel from "../../components/ui/RoleLabel";
import { Roles } from "../../const";

const trainingIcons: Record<string, string> = {
  "הדרכת בטיחות": "🛡️",
  "רענון רוני": "🔄",
  "רענון נשק": "🔫",
  "רענון אזרה ראשונה": "🩹",
  "הדרכת סמכויות": "📜"
};

export default function EmployeesPage() {
  const users = useSelector((state: any) => state.data.users);

  const getRoleObject = (roleValue: string) => {
    return Roles.find(r => r.value === roleValue);
  };

  const getTrainingIcon = (trainingTitle: string): string => {
    return trainingIcons[trainingTitle] || "📋";
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
                  <td>
                    {user.trainings && Object.values(user.trainings).map((training: any) =>
                      training.executionDate ? (
                        <span
                          key={training.id}
                          title={`${training.title} - ${new Date(training.executionDate.toDate()).toLocaleDateString('he-IL')}`}
                          className="training-icon"
                        >
                          {getTrainingIcon(training.title)}
                        </span>
                      ) : null
                    )}
                  </td>
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
