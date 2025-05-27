import { useEffect, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
  const { unsetUser } = useContext(UserContext);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    unsetUser(); // clear user from context and localStorage
    setLoggedOut(true);
  }, [unsetUser]);

  if (loggedOut) {
    return <Navigate to="/login" />;
  }

  return <div>Logging out...</div>;
}
