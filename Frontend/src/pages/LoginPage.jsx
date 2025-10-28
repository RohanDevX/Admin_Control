// // import { useContext, useState } from 'react';
// // import { AuthCtx } from '../context/AuthContext';

// // export default function Login() {
// //   const { login } = useContext(AuthCtx);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [err, setErr] = useState('');

// //   const handleSubmit = async e => {
// //     e.preventDefault();
// //     try {
// //       await login(email, password);
// //     } catch (error) {
// //       setErr(error?.response?.data?.error || 'Login failed');
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="login-form">
// //       <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
// //       <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
// //       {err && <p style={{ color: 'red' }}>{err}</p>}
// //       <button>Log in</button>
// //     </form>
// //   );
// // }

// import { useContext, useState } from "react";
// import { AuthCtx } from "../context/AuthContext";

// export default function LoginPage() {
//   const { login } = useContext(AuthCtx);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     try {
//       await login(email.trim(), password);
//     } catch (error) {
//       setErr(error?.response?.data?.error || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="login-section">
//       <style>{`
//         /* —— Mysuru Royal Palette —— */
//         :root {
//           --royal-red: #7A133D;
//           --heritage-red: #C62039;
//           --royal-gold: #D2A857;
//           --royal-cream: #FFF9F2;
//           --sage: #8BBAA1;
//           --teal: #056675;
//         }

//         /* —— Layout —— */
//         .login-section {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(135deg, var(--royal-gold) 0%, var(--sage) 35%, var(--teal) 100%);
//           padding: 1rem;
//           font-family: "Merriweather", "Georgia", serif;
//         }
//         .login-card {
//           width: 100%;
//           max-width: 22rem; /* phones */
//           background: var(--royal-cream);
//           border-radius: 1.25rem;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//           padding: 1.75rem 1.5rem;
//           display: flex;
//           flex-direction: column;
//           gap: 1.25rem;
//         }
//         .login-title {
//           color: var(--heritage-red);
//           text-align: center;
//           font-size: 1.75rem;
//           font-weight: 900;
//           letter-spacing: 0.02em;
//         }
//         .login-field {
//           display: flex;
//           flex-direction: column;
//           gap: 0.25rem;
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: var(--royal-red);
//         }
//         .login-field input {
//           border: 2px solid transparent;
//           border-radius: 0.5rem;
//           padding: 0.5rem 0.75rem;
//           font-size: 0.95rem;
//           transition: border-color 0.2s, box-shadow 0.2s;
//         }
//         .login-field input:focus {
//           border-color: var(--royal-gold);
//           outline: none;
//           box-shadow: 0 0 0 3px rgba(210,168,87,0.35);
//         }
//         .login-button {
//           background: var(--heritage-red);
//           color: #fff;
//           border: none;
//           border-radius: 0.5rem;
//           padding: 0.6rem;
//           font-size: 1rem;
//           font-weight: 700;
//           cursor: pointer;
//           transition: transform 0.15s, background 0.15s;
//         }
//         .login-button:hover { background: var(--royal-red); }
//         .login-button:active { transform: translateY(2px); }
//         .login-button:disabled { opacity: 0.6; cursor: default; }
//         .login-error {
//           color: #b91c1c;
//           text-align: center;
//           font-weight: 600;
//           font-size: 0.875rem;
//         }

//         /* —— Tablet enhancements —— */
//         @media (min-width: 640px) {
//           .login-card {
//             max-width: 28rem; /* tablets */
//             padding: 2.25rem 2rem;
//             gap: 1.5rem;
//           }
//           .login-title { font-size: 2.25rem; }
//         }
//       `}</style>

//       <form onSubmit={handleSubmit} className="login-card">
//         <h1 className="login-title">Mysuru Admin</h1>

//         <label className="login-field">
//           Email
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="you@example.com"
//             required
//           />
//         </label>

//         <label className="login-field">
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             placeholder="••••••••"
//             required
//           />
//         </label>

//         {err && <p className="login-error">{err}</p>}

//         <button type="submit" disabled={loading} className="login-button">
//           {loading ? "Logging in…" : "Log In"}
//         </button>
//       </form>
//     </section>
//   );
// }


import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCtx } from "../context/AuthContext";
import bgImg from "../assets/1.png"

export default function LoginPage() {
  const { login } = useContext(AuthCtx);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);




  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await login(email.trim(), password);
      // 🎉 success – send user to the protected list
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <style>{`
        /* —— Mysuru Royal Palette —— */
        :root {
          --royal-red: #7A133D;
          --heritage-red: #C62039;
          --royal-gold: #D2A857;
          --royal-cream: #FFF9F2;
          --sage: #8BBAA1;
          --teal: #056675;
        }

        /* —— Layout —— */
       .login-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          /* fallback gradient if image fails */
          background: linear-gradient(135deg, var(--royal-gold) 0%, var(--sage) 35%, var(--teal) 100%);
          /* image overlay */
          background-image: url(${bgImg}), linear-gradient(135deg, rgba(210,168,87,0.7) 0%, rgba(139,186,161,0.7) 35%, rgba(5,102,117,0.7) 100%);
          background-size: cover;
          background-position: center;

          padding: 1rem;
          font-family: "Merriweather", "Georgia", serif;
        }
        .login-card {
          width: 100%;
          max-width: 22rem; /* phones */
          background: #fff9f24a;
          border-radius: 1.25rem;
          box-shadow: 0 10px 25px rgba(228, 220, 220, 0.1);
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .login-title {
          color: var(--heritage-red);
          text-align: center;
          font-size: 1.75rem;
          font-weight: 900;
          letter-spacing: 0.02em;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--royal-red);
        }
        .login-field input {
          border: 2px solid transparent;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-field input:focus {
          border-color: var(--royal-gold);
          outline: none;
          box-shadow: 0 0 0 3px rgba(210,168,87,0.35);
        }
        .login-button {
          background: var(--heritage-red);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.6rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, background 0.15s;
        }
        .login-button:hover { background: var(--royal-red); }
        .login-button:active { transform: translateY(2px); }
        .login-button:disabled { opacity: 0.6; cursor: default; }
        .login-error {
          color: #b91c1c;
          text-align: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        /* —— Tablet enhancements —— */
        @media (min-width: 640px) {
          .login-card {
            max-width: 28rem; /* tablets */
            padding: 2.25rem 2rem;
            gap: 1.5rem;
          }
          .login-title { font-size: 2.25rem; }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="login-card">
        <h1 className="login-title">Mysuru Admin</h1>

        <label className="login-field">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

         <label className="login-field">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>



        {err && <p className="login-error">{err}</p>}

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Logging in…" : "Log In"}
        </button>
      </form>
    </section>
  );
}
