import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Divider, Typography, Stack, MenuItem, IconButton, Popover } from '@mui/material';
// mocks_
import { Icon } from '@iconify/react';
import { useAppContext } from '../../../context/context';
import { auth } from '../../../firebase/firebase';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    try {
      const { getAuth, signOut } = auth;
      const authInstance = getAuth();

      signOut(authInstance)
        .then(() => {
          navigate('/login');
        })
        .catch((error) => {
          // An error happened.
          console.log('Error! While signing out');
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleNavigation = (pathname) => {
    navigate(pathname);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Icon icon={'ph:user'} width={25} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 200,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>{user?.email}</Typography>
        </Box>

        <Stack sx={{ p: 1 }}>
          {user ? (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem key={'Home'} onClick={() => handleNavigation('/catalog')}>
                {'Home'}
              </MenuItem>
              <MenuItem key={'Profile'} onClick={() => handleNavigation('/profile')}>
                {'Profile'}
              </MenuItem>
              <MenuItem key={'Cart'} onClick={() => handleNavigation('/cart')}>
                {'Cart'}
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem key={'Login'} onClick={() => handleNavigation('/login')}>
                {'Login'}
              </MenuItem>
              <MenuItem key={'Home'} onClick={() => handleNavigation('/catalog')}>
                {'Home'}
              </MenuItem>
            </>
          )}
        </Stack>

        {user ? (
          <Stack sx={{ p: 1 }}>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </Stack>
        ) : null}
      </Popover>
    </>
  );
}
