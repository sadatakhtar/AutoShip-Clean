// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(localStorage.getItem("jwtToken"));
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (!token) {
//       setUser(null);
//       return;
//     }

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const role =
//         payload[
//           "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
//         ];
//       const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

//       setUser({ username, role });
//     } catch (err) {
//       console.error("Invalid token", err);
//       setUser(null);
//     }
//   }, [token]);

//   const login = (jwt) => {
//     localStorage.setItem("jwtToken", jwt);
//     setToken(jwt);
//   };

//   const logout = () => {
//     localStorage.removeItem("jwtToken");
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const username =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      setUser({ username, role });
    } catch (err) {
      console.error("Invalid token", err);
      setUser(null);
    }
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem("jwtToken", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

