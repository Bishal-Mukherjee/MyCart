import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';

import { bgBlur } from '../../../utils/cssStyles';
import AccountPopover from './AccountPopover';

import MyCartLogo from '../../../assets/MyCartLogo.svg';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 50;

const HEADER_DESKTOP = 70;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: '100%',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Header() {
  const navigate = useNavigate();
  return (
    <StyledRoot>
      <StyledToolbar>
        <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/catalog')}>
          <img alt="logo" src={MyCartLogo} style={{ width: 50, height: 50 }} />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
