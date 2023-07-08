import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { signin } from '../../../services/user';
import AlertMessage from '../../../custom/AlertMessage';

export default function SignIn({ setAuthNavigation }) {
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
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
      email: '',
      password: '',
    },
    onSubmit: async () => {
      setShowLoader(true);
      try {
        const response = await signin({ ...formik.values });
        if (response.user) {
          navigate('/catalog');
        }
      } catch (err) {
        console.log(err.message);
        setShowLoader(false);
        setMessage({
          type: 'error',
          text: 'Failed to login',
        });
      }
    },
  });

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sign In to MyCart
      </Typography>

      {message.type ? <AlertMessage message={message} setMessage={setMessage} /> : null}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={1.5} mt={2}>
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

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Stack direction={'row'} alignItems={'center'}>
              <Checkbox name="remember" label="Remember me" />
              <Typography>Remember me?</Typography>
            </Stack>

            <Link variant="subtitle2" underline="hover">
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={showLoader}>
            Sign In
          </LoadingButton>
        </Stack>
      </form>

      <Typography sx={{ display: 'flex', mt: 2 }}>
        Not registered?&nbsp;{' '}
        <Typography
          onClick={() => setAuthNavigation(1)}
          sx={{ textDecoration: 'underline', color: '#0077b6', cursor: 'pointer' }}
        >
          {' '}
          Sign up
        </Typography>
      </Typography>
    </>
  );
}
