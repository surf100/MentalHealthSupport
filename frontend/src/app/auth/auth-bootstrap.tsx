// import { useEffect } from "react";
// import { getCurrentUser } from "../api/auth-api";
// import { useAuth } from "./auth-context";

// export function AuthBootstrap({ children }: { children: React.ReactNode }) {
//   const { token, setUser, logout, isInitializing, setIsInitializing } = useAuth();

//   useEffect(() => {
//     let isMounted = true;

//     async function bootstrapAuth() {
//       try {
//         if (!token) {
//           if (isMounted) {
//             setUser(null);
//             setIsInitializing(false);
//           }
//           return;
//         }

//         const user = await getCurrentUser();

//         if (isMounted) {
//           setUser(user);
//           setIsInitializing(false);
//         }
//       } catch {
//         if (isMounted) {
//           logout();
//           setIsInitializing(false);
//         }
//       }
//     }

//     bootstrapAuth();

//     return () => {
//       isMounted = false;
//     };
//   }, [token, setUser, logout, setIsInitializing]);

//   if (isInitializing) {
//     return null;
//   }

//   return <>{children}</>;
// }