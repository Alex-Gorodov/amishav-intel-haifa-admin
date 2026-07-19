import { useSelector } from "react-redux";
import { useAITheme } from "../../../hooks/useAIContext";
import { RootState } from "../../../store/root-reducer";
import DashboardUser from "../DashboardUser/DashboardUser";
import { securityRoles, controlRoomRoles, emergencyRoles } from "../../../const";
import { useDragScroll } from "../../../hooks/useDragScroll";

export default function DashboardUsers() {

  // Theme control
  const { isAI } = useAITheme();
  const className = isAI ? 'dashboard-ai' : 'dashboard';

  // Users
  const users = useSelector((state: RootState) => state.data.users)

  const security = users.filter(user =>
    user.roles.some(role => securityRoles.includes(role))
  );

  const controlRoom = users.filter(user =>
    user.roles.some(role => controlRoomRoles.includes(role))
  );

  const emergency = users.filter(user =>
    user.roles.some(role => emergencyRoles.includes(role))
  );

  const securityScroll = useDragScroll();
  const controlScroll = useDragScroll();
  const emergencyScroll = useDragScroll();

  return (
    <div className={`${className}__card ${className}__card--users`}>
      {/* <p className={`${className}__label`}>
        צוות
      </p> */}
      <div className={`${className}__card-content ${className}__card-content--users`}>
        <div>
          <p style={{ textAlign: 'center', color: '#979797', marginBottom: 4, margin: 0, padding: 0 }}>ביטחון</p>
          <div className="dashboard__users" ref={securityScroll.ref} {...securityScroll.events}>
          {
            security.map((u) => {
              return (
                <DashboardUser user={u} key={u.id}/>
              )
            })
          }
        </div>
        </div>
        <div>
          <p style={{ textAlign: 'center', color: '#979797', marginBottom: 4, margin: 0, padding: 0 }}>חדר בקרה</p>
          <div className="dashboard__users" ref={controlScroll.ref} {...controlScroll.events}>

          {
            controlRoom.map((u) => {
              return (
                <DashboardUser user={u} key={u.id}/>
              )
            })
          }
        </div>
        </div>
        <div>
          <p style={{ textAlign: 'center', color: '#979797', marginBottom: 4, margin: 0, padding: 0 }}>חירום</p>
          <div className="dashboard__users" ref={emergencyScroll.ref} {...emergencyScroll.events}>
          {
            emergency.map((u) => {
              return (
                <DashboardUser user={u} key={u.id}/>
              )
            })
          }
        </div>
        </div>
      </div>

    </div>
  )
}
