import { Role } from "../../types/User";

export default function RoleLabel({ role }: { role: Role }) {
  return (
    <div className="employee__role-label">
      <span>{role.label}</span>
    </div>
  );
}
