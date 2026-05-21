// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// import { auth } from "../../services/firebase";
// import { useAITheme } from "../../hooks/useAIContext";
// import { AppRoute } from "../../const";
// import Layout from "../../components/Layout/Layout";

// export default function AuthPage() {
//   const navigate = useNavigate();
//   const { isAI } = useAITheme();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setError(null);

//     if (!email || !password) {
//       setError("יש למלא אימייל וסיסמה");
//       return;
//     }

//     try {
//       setLoading(true);

//       await signInWithEmailAndPassword(auth, email, password);

//       navigate(AppRoute.Root);
//     } catch (err: any) {
//       console.error(err);

//       switch (err.code) {
//         case "auth/invalid-credential":
//           setError("אימייל או סיסמה שגויים");
//           break;

//         case "auth/too-many-requests":
//           setError("יותר מדי ניסיונות התחברות");
//           break;

//         default:
//           setError("שגיאה בהתחברות");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="page page--auth">
//         <form
//           onSubmit={handleLogin}
//           method="POST"
//           className={`form ${isAI ? "form--ai-theme" : ""}`}
//         >
//           <div className="form__wrapper form__wrapper--fullscreen">

//             <h1 className="form__title">
//               התחברות
//             </h1>

//             <div
//               className={`form__error-wrapper ${
//                 error ? "form__error-wrapper--active" : ""
//               }`}
//             >
//               <p className="form__error-message">
//                 {error}
//               </p>
//             </div>

//             <div className="form__wrapper">
//               <input
//                 type="email"
//                 className="form__input"
//                 placeholder="אימייל"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <input
//                 type="password"
//                 className="form__input"
//                 placeholder="סיסמה"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <button
//               type="submit"
//               className="button button--wide"
//               disabled={loading}
//             >
//               {loading ? "מתחבר..." : "התחבר"}
//             </button>

//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAITheme } from "../../hooks/useAIContext";
import { AppRoute } from "../../const";
import { signInUser } from "../../store/api/signIn.api";
import Layout from "../../components/Layout/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAI } = useAITheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier || !password) {
      setError("יש למלא פרטים");
      return;
    }

    try {
      setLoading(true);

      const isEmail = identifier.includes("@");

      await signInUser(
        {
          type: isEmail ? "email" : "passportId",
          value: identifier.trim(),
        },
        password
      );

      navigate(AppRoute.Root);

    } catch (err: any) {
      console.log("LOGIN ERROR:", err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
        <form
          onSubmit={handleLogin}
          method="POST"
          className={`form ${isAI ? "form--ai-theme" : ""}`}
        >
          <div className="form__wrapper form__wrapper--fullscreen">
            <h1 className="form__title">התחברות</h1>

            {
              <div className={`form__error-wrapper ${error ? 'form__error-wrapper--active' : ''}`}>
                <p className='form__error-message'>{error}</p>
              </div>
            }

            <input
              className="form__input"
              placeholder="תעודת זהות / אימייל"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <input
              className="form__input"
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="button button--wide" type="submit" disabled={loading}>
              {loading ? "מתחבר..." : "התחבר"}
            </button>
          </div>
        </form>
    </Layout>
  );
}
