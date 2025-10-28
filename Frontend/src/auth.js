// import { createContext, useContext, useEffect, useState } from 'react';
// import { api } from './api';

// const AuthCtx = createContext(null);
// export const useAuth = () => useContext(AuthCtx);

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // on mount, ask server “who am I?”
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get('/auth/me');
//         setUser(data.user);
//       } catch {/* not logged in */}
//       setLoading(false);
//     })();
//   }, []);

// // src/auth.js
// const login = async (email, password) => {
//   const { data } = await api.post('/auth/login', { email, password });
//   setUser(data);                           // { id, name }
//   localStorage.setItem('user', JSON.stringify(data));
// };

// const logout = () => {
//   setUser(null);
//   localStorage.removeItem('user');
//   // optional: call backend just so it returns 200
//   api.post('/auth/logout').catch(()=>{});
// };

//   if (loading) return <div style={{padding:'2rem'}}>Loading…</div>;

//   return (
//     <AuthCtx.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthCtx.Provider>
//   );
// }


// import { createContext, useContext, useState } from 'react';
// import { api } from './api';

// const AuthCtx = createContext(null);
// export const useAuth = () => useContext(AuthCtx);

// export default function AuthProvider({ children }) {
//   /* try to hydrate from previous login */
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem('user') || 'null')
//   );

//   /* ---------- helpers ---------- */
//   const login = async (email, password) => {
//     const { data } = await api.post('/auth/login', { email, password });
//     setUser(data);                                // { id, name }
//     localStorage.setItem('user', JSON.stringify(data));
//   };

//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     api.post('/auth/logout').catch(() => {});     // fire-and-forget
//   };

//   /* ---------- provider ---------- */
//   return (
//     <AuthCtx.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthCtx.Provider>
//   );
// }




// src/AuthProvider.jsx
import {
  createContext, useContext, useState, useEffect, useRef
} from 'react';
import { api } from './api';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  /* -------- state hydration -------- */
  const [user , setUser ] = useState(
    JSON.parse(localStorage.getItem('user')   || 'null')
  );
  const [token, setToken] = useState(
    localStorage.getItem('access') || null
  );
  /* a ref that the interceptors can ALWAYS read */
  const tokenRef = useRef(token);
  useEffect(() => { tokenRef.current = token; }, [token]);

  /* -------- Axios interceptors -------- */
  useEffect(() => {
    /* add Authorization on every request */
    const reqId = api.interceptors.request.use(cfg => {
      if (tokenRef.current) {
        cfg.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return cfg;
    });

    /* handle 401 → silent refresh + retry */
    const resId = api.interceptors.response.use(
      res => res,
      async err => {
        const original = err.config;
        if (
          err.response?.status === 401 &&
          !original._retry                    // prevent infinite loops
        ) {
          original._retry = true;
          try {
            /* ask backend to rotate refresh-token -> new access-token */
            const { data } = await api.post('/auth/refresh');
            /* persist & update state */
            setToken(data.accessToken);
            localStorage.setItem('access', data.accessToken);
            /* retry the original call */
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
          } catch (e) {
            /* refresh failed – force full logout */
            await logout();
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, []); // mount once

  /* -------- helpers -------- */
  const login = async (email, password) => {
    const { data } = await api.post(
      '/auth/login',
      { email, password }
    );
    /* server returns { accessToken, user:{…} } */
    setUser (data.user);
    setToken(data.accessToken);
    localStorage.setItem('user' , JSON.stringify(data.user));
    localStorage.setItem('access', data.accessToken);
  };

  const logout = async () => {
    /* optimistic UI – clear immediately */
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access');
    /* clear refresh-token cookie on the server (best-effort) */
    api.post('/auth/logout').catch(() => {});
  };

  /* -------- context value -------- */
  return (
    <AuthCtx.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
