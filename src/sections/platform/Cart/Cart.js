import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Backdrop,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardMedia,
  Link,
  Stack,
  Checkbox,
} from '@mui/material';

import { Icon } from '@iconify/react';
import { remove } from 'lodash';
import { useAppContext } from '../../../context/context';
import { getcart, removefromcart } from '../../../services/cart';

const CartItemCard = ({ cartItem, handleAddItems, handleRemoveItem, isChecked }) => {
  const {
    title,
    image,
    price,
    id,
    rating: { rate, count },
  } = cartItem;

  const handleBuyProduct = () => {
    try {
      window.confirm(`Final bill amount ₹ ${price}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card sx={{ m: 1 }}>
      <Box sx={{ height: 50, display: 'flex', justifyContent: 'flex-end' }}>
        <Checkbox onClick={() => handleAddItems(cartItem)} checked={isChecked} />
      </Box>

      <CardMedia sx={{ height: 180, width: 'auto' }} image={image} title={title} />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

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

        <Stack direction={'row'} spacing={1}>
          <Button onClick={() => handleRemoveItem()} sx={{ width: '100%' }} color={'error'} variant={'text'}>
            Remove
          </Button>

          <Button onClick={() => handleBuyProduct()} sx={{ width: '100%' }} variant="contained">
            Buy
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

const Cart = () => {
  const { user } = useAppContext();

  const [showLoader, setShowLoader] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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

  const handleAddItems = (tempItem) => {
    try {
      if (selectedItems.filter((item) => item.productid === tempItem.productid).length > 0) {
        remove(selectedItems, (item) => item.productid === tempItem.productid);
        setSelectedItems([...selectedItems]);
      } else {
        setSelectedItems((prevstate) => [...prevstate, tempItem]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveItem = async (productid) => {
    try {
      const response = await removefromcart({ userEmail: user.email, productid });
      setCartItems(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = () => {
    try {
      let amount = 0;
      for (let i = 0; i < cartItems.length; i += 1) {
        amount += parseFloat(cartItems[i].price);
      }

      if (amount) {
        window.confirm(`Final bill amount ₹ ${amount.toFixed(2)}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetCart();
  }, [user]);

  return (
    <Container maxWidth>
      {showLoader ? (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showLoader}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => handleCheckout()} sx={{ p: 1 }} disabled={Boolean(selectedItems.length <= 0)}>
          <Icon icon={'ion:cart'} />
          Checkout
        </Button>
      </Box>

      <Grid container spacing={1}>
        {cartItems?.map((cartItem, index) => (
          <Grid item xs={12} md={3} key={index}>
            <CartItemCard
              cartItem={cartItem}
              handleAddItems={handleAddItems}
              handleRemoveItem={() => handleRemoveItem(cartItem.productid)}
              isChecked={selectedItems.filter((item) => item.productid === cartItem.productid).length > 0}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Cart;
