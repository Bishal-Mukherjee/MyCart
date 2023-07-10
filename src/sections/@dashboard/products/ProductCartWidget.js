import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Drawer,
  Button,
  CardMedia,
  Grid,
  List,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { ProductDialog } from '../../platform/Catalog/Product/Product';
import { getcart, removefromcart } from '../../../services/cart';
import { useAppContext } from '../../../context/context';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(20),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

const CartItem = ({ product, handleRemoveCartItem, handleProductSelection }) => {
  const {
    title,
    image,
    price,
    quantity,
    rating: { rate, count },
  } = product;

  return (
    <Card sx={{ m: 1 }}>
      <CardMedia sx={{ height: 180, width: 'auto' }} image={image} title={title} />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

        <Stack direction="column">
          <Typography variant="subtitle1" sx={{ ml: 'auto', mr: 1 }}>
            Qty: {quantity}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
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
        </Stack>

        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              sx={{
                width: '100%',
                bgcolor: '#fb4b4e',
                ':hover': {
                  backgroundColor: '#fb4b4e',
                },
              }}
              onClick={() => handleRemoveCartItem()}
            >
              Remove
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" onClick={() => handleProductSelection()} sx={{ width: '100%' }}>
              View
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
};

function CartDrawer({ setOpen }) {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [billingAmount, setBillingAmount] = useState(0);

  const handleProductSelection = async (product) => {
    try {
      setSelectedProduct(product);
      setShowProductDialog(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetCart = async () => {
    try {
      setShowLoader(true);
      const response = await getcart(user.email);
      setCartItems(response.items);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveCartItem = async ({ product }) => {
    try {
      const remainingItems = await removefromcart({ userEmail: user.email, product });
      setCartItems(remainingItems);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCalculateBilling = () => {
    try {
      let amount = 0;
      for (let i = 0; i < cartItems.length; i += 1) {
        amount += parseFloat(cartItems[i].price);
      }
      setBillingAmount(amount.toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetCart();
  }, []);

  useEffect(() => {
    handleCalculateBilling();
  }, [cartItems]);

  return (
    <Box>
      <Drawer
        sx={{
          '.MuiDrawer-paper': {
            overflowY: 'hidden',
          },
        }}
        anchor={'right'}
        open
        onClose={() => setOpen(false)}
      >
        {user ? (
          <Box sx={{ width: 320, height: '100%' }}>
            {showLoader ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress sx={{ color: 'black' }} />
              </Box>
            ) : null}

            <Box sx={{ width: '100%', height: 700, overflowY: 'scroll' }}>
              {cartItems.length ? (
                <Box>
                  <List sx={{ mt: 1 }}>
                    {cartItems?.map((cartItem, index) => (
                      <Box key={index}>
                        <CartItem
                          product={cartItem}
                          handleProductSelection={() => handleProductSelection(cartItem)}
                          handleRemoveCartItem={() => handleRemoveCartItem({ product: cartItem })}
                        />
                      </Box>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction={'column'} spacing={2} alignItems={'center'}>
                    <Icon icon={'mdi:cart'} width={30} />

                    <Typography variant="body1">Your cart is empty</Typography>
                    <Button variant="contained" onClick={() => setOpen(false)}>
                      Shop now
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: 320, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack direction={'column'} spacing={2} alignItems={'center'}>
              <Icon icon={'mdi:cart'} width={30} />
              <Typography variant="body1">Your MyCart.com cart is empty</Typography>
              <Button variant="contained" onClick={() => navigate('/login')}>
                Sign in to your account
              </Button>
            </Stack>
          </Box>
        )}

        {user ? (
          <Box
            sx={{
              height: 80,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              border: 'dotted 1px #8d99ae',
            }}
          >
            <Typography variant="subtitle1">Payable: ₹ {billingAmount}</Typography>
            <Button
              variant="text"
              sx={{
                bgcolor: '#caf0f8',
                color: '#1d3557',
                ':hover': {
                  bgcolor: '#caf0f8',
                },
              }}
              onClick={() => navigate('/cart')}
            >
              Checkout
            </Button>
          </Box>
        ) : null}
      </Drawer>

      {showProductDialog ? (
        <ProductDialog open={showProductDialog} setOpen={setShowProductDialog} selectedProduct={selectedProduct} />
      ) : null}
    </Box>
  );
}

export default function CartWidget() {
  const [showCart, setShowCart] = useState(false);

  return (
    <StyledRoot>
      <Box onClick={() => setShowCart(true)}>
        <Tooltip title={'View Cart'}>
          <Icon icon="eva:shopping-cart-fill" width={24} height={24} />
        </Tooltip>
      </Box>
      {showCart ? <CartDrawer open={showCart} setOpen={setShowCart} /> : null}
    </StyledRoot>
  );
}
