import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import { Toggle } from "../../components/ui/Toggle";

export default function RequestsPage() {
  const swapRequests = useSelector((state: RootState) => state.data.giveRequests);
  const giveRequests = useSelector((state: RootState) => state.data.giveRequests);

  const [active, setActive] = useState<'give' | 'swap'>('swap')

  const handleToggleChange = (isGive: boolean) => {
    setActive(isGive ? 'swap' : 'give');
  };

  return (
    <Layout>
      <div className="page">
        <h1 className="page__title">בקשות לשינויים</h1>
        <div className="toggle__container">
          <Toggle value={active === 'swap'} leftLabel="בקשות החלפה" rightLabel="בקשות מסירה" onChange={handleToggleChange}/>

          {
            active === 'swap'
            ?
            swapRequests.length !== 0
              ?
              swapRequests.map((r) => {
                return (
                  <div>
                    <p>
                      swap: {r.firstUserId}
                    </p>
                  </div>
                )
              })
              :
              <p>אין בקשות החלפה</p>
            :
            giveRequests.length !== 0
            ?
              giveRequests.map((r) => {
                return (
                  <div>
                    <p>
                      give: {r.firstUserId}
                    </p>
                  </div>
                )
              })
              :
              <p>אין בקשות מסירה</p>
          }
        </div>
      </div>
    </Layout>
  )
}
