import React, { useState, useEffect, useContext, createContext } from 'react';
import { useLocation } from 'react-router-dom';
// import { Alert, Snackbar } from '@mui/material';
import { auth } from '../firebase/firebase';

const Context = createContext({
  user: {},
});

export function useAppContext() {
  return useContext(Context);
}

export const AppContext = ({ children }) => {
  const { Provider } = Context;
  const { getAuth, onAuthStateChanged } = auth;
  const location = useLocation();

  const [snackbar, setSnackbar] = useState({ text: '', type: '' });
  const [user, setUser] = useState({});

  useEffect(() => {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, async (authuser) => {
      if (authuser) {
        setUser(authuser);
      } else {
        setUser(null);
      }
    });
  }, [location]);

  const contextobj = {
    user,
  };

  return (
    <Provider value={contextobj}>
      {/* {snackbar.text ? (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(Object.values(snackbar).length)}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ type: '', text: '' })}
        >
          <Alert sx={{ color: 'white', minWidth: 200 }} variant="filled" severity={snackbar.type}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      ) : null} */}
      {children}
    </Provider>
  );
};
