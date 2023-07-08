import PropTypes from 'prop-types';
// @mui
import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  IconButton,
  Button,
  CardMedia,
  Tooltip,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import AlertMessage from '../../../../custom/AlertMessage';
import { addtocart } from '../../../../services/cart';
import { useAppContext } from '../../../../context/context';

// utils
// components

// ----------------------------------------------------------------------

const trimText = (text) => {
  if (text) {
    if (text.length > 35) {
      return `${text.substring(0, 36)}...`;
    }
    return text;
  }
  return '';
};

// ----------------------------------------------------------------------

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ProductCard({ product, handleProductSelection }) {
  const {
    title,
    image,
    price,
    description,
    rating: { rate, count },
  } = product;

  const { user } = useAppContext();

  const [showLoader, setShowLoader] = useState(false);
  const [message, setMessage] = useState({});

  const handleAddToCart = async () => {
    try {
      setShowLoader(true);
      await addtocart({ userEmail: user.email, product });
      setShowLoader(false);
      setMessage({ text: 'Added to cart' });
    } catch (err) {
      console.log(err);
      setMessage({ text: 'Failed to add' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage({ text: '' });
    }, 3000);
  }, [message]);

  return (
    <Card>
      <Box m={0.5} display={'flex'} justifyContent={'flex-end'}>
        {user ? (
          <Tooltip title={'Add to cart'}>
            <IconButton onClick={() => handleAddToCart()}>
              {message.text ? (
                <Icon color={'green'} icon={'basil:check-outline'} />
              ) : (
                <Icon icon={showLoader ? 'line-md:loading-twotone-loop' : 'mdi:cart'} />
              )}
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>

      <CardMedia sx={{ height: 200 }} image={image} title={title} />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

        <Typography variant="subtitle2">{trimText(description)}</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">₹ {price}</Typography>
          <Box display={'flex'}>
            <Box m={0.5} display={'flex'} alignItems={'center'}>
              <Icon icon={'twemoji:star'} width={20} />
              <Typography variant="subtitle1">{rate}</Typography>
            </Box>
            <Box m={0.5} display={'flex'} alignItems={'center'}>
              <Icon icon={'mdi:users'} width={20} />
              <Typography variant="subtitle1">{count}</Typography>
            </Box>
          </Box>
        </Stack>

        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <Button
              variant="contained"
              sx={{
                width: '100%',
              }}
              onClick={() => handleProductSelection()}
            >
              View
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
}

export const ProductDialog = ({ open, setOpen, selectedProduct }) => {
  const {
    title,
    description,
    price,
    image,
    rating: { rate, count },
  } = selectedProduct;

  const { user } = useAppContext();
  const [showLoader, setShowLoader] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [message, setMessage] = useState({});

  const handleAddToCart = async () => {
    try {
      if (user) {
        setShowLoader(true);
        const response = await addtocart({ userEmail: user.email, product: selectedProduct });
        setShowLoader(false);

        if (response) {
          setMessage({ text: 'Added to cart', type: 'success' });
        }
      } else {
        setMessage({ text: 'Login to product', type: 'error' });
      }
    } catch (err) {
      console.log(err);
      setMessage({ text: 'Failed! Please try again', type: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {message.type ? <AlertMessage message={message} setMessage={setMessage} /> : null}

      <DialogContent>
        <Box sx={{ m: 2, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '65%', height: 360 }}>
            <img style={{ width: '100%', height: '100%' }} src={image} alt={title} />
          </Box>
        </Box>

        <DialogContentText>
          <Typography variant="subtitle1" noWrap>
            {title}
          </Typography>
          <Typography mt={1} variant="subtitle2" flexWrap>
            {description}
          </Typography>
        </DialogContentText>

        <Stack mt={2} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">₹ {price}</Typography>
          <Box display={'flex'}>
            <Box m={0.5} display={'flex'} alignItems={'center'}>
              <Icon icon={'ic:round-star'} width={20} />
              <Typography variant="subtitle1">{rate}</Typography>
            </Box>
            <Box m={0.5} display={'flex'} alignItems={'center'}>
              <Icon icon={'mdi:users'} width={20} />
              <Typography variant="subtitle1">{count}</Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton onClick={() => handleAddToCart()} loading={showLoader}>
          Add to Cart
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
