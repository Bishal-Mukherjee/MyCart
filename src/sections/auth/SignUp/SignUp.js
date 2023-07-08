import { useState } from 'react';
import { Stack, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { signup } from '../../../services/user';
import AlertMessage from '../../../custom/AlertMessage';

export default function SignUp({ setAuthNavigation }) {
  const validationSchema = yup.object().shape({
    name: yup.string().required('Please enter name'),
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
      .required('Please enter email'),
    password: yup
      .string()
      .matches(/^.{6,}$/, 'Password must be of six characters')
      .required('Please enter password'),
  });

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async () => {
      setShowLoader(true);
      try {
        const response = await signup({ ...formik.values });
        if (response.user) {
          setMessage({
            type: 'success',
            text: 'Registration successful! Please login',
          });

          setShowLoader(false);
        }
      } catch (err) {
        console.log(err.message);
        setShowLoader(false);
        setMessage({
          type: 'error',
          text: 'Failed to register',
        });
      }
    },
  });

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sign Up to MyCart
      </Typography>

      {message.type ? <AlertMessage message={message} setMessage={setMessage} /> : null}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={1.5} mt={2}>
          <TextField
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            label="Enter name"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            label="Enter email address"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Icon icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={showLoader}>
            Sign Up
          </LoadingButton>
        </Stack>
      </form>

      <Typography sx={{ display: 'flex', mt: 2 }}>
        Already registered?&nbsp;{' '}
        <Typography
          onClick={() => setAuthNavigation(0)}
          sx={{ textDecoration: 'underline', color: '#0077b6', cursor: 'pointer' }}
        >
          {' '}
          Sign in
        </Typography>
      </Typography>
    </>
  );
}
