import React, { useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';

// sections
import SignIn from './SignIn/SignIn';
import SingnUp from './SignUp/SignUp';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function AuthWrapper() {
  const mdUp = useResponsive('up', 'md');

  const [authNavigation, setAuthNavigation] = useState(0);

  const AUTH_SECTION_OBJ = {
    0: <SignIn setAuthNavigation={setAuthNavigation} />,
    1: <SingnUp setAuthNavigation={setAuthNavigation} />,
  };

  return (
    <>
      <Helmet>
        <title> Login | MyCart </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>{AUTH_SECTION_OBJ[authNavigation]}</StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
