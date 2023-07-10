import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Backdrop,
  CircularProgress,
  Container,
  Grid,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import ProductCard, { ProductDialog } from './Product/Product';
import { getcategories, getproducts } from '../../../services/product';
import { applyfilter } from '../../../helpers/filter';
import ProductCartWidget from '../../@dashboard/products/ProductCartWidget';

const Catalog = () => {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [products, setProducts] = useState([]);

  const [showLoader, setShowLoader] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCatagory, setSelectedCatagory] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const handleGetProducts = async () => {
    try {
      setShowLoader(true);
      if (selectedCatagory) {
        const response = await getproducts(selectedCatagory);
        setProducts(response);
      } else {
        const response = await getproducts();
        setProducts(response);

        const categoryResponse = await getcategories();
        const tempCategories = categoryResponse.map((c) => ({
          label: String(c),
        }));
        setCategories(tempCategories);
      }
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApplyFilter = (tempFilter) => {
    try {
      if (tempFilter) {
        setShowLoader(true);
        if (tempFilter === 'price:lowtohigh') {
          const response = applyfilter(products, { variableName: 'price', ordering: 'ascending' });
          setProducts(response);
          setShowLoader(false);
        }

        if (tempFilter === 'price:hightolow') {
          const response = applyfilter(products, { variableName: 'price', ordering: '' });
          setProducts(response);
          setShowLoader(false);
        }

        if (tempFilter === 'rate:hightolow') {
          const response = applyfilter(products, { variableName: 'rating', ordering: '' });
          setProducts(response);
          setShowLoader(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleProductSelection = async (product) => {
    try {
      setSelectedProduct(product);
      setShowProductDialog(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, [selectedCatagory]);

  return (
    <Container maxWidth>
      {showLoader ? (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showLoader}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <Box>
        <Autocomplete
          disablePortal
          value={selectedCatagory}
          onChange={(event, newValue) => {
            setSelectedCatagory(newValue.label);
          }}
          onInputChange={(event, newInputValue) => {
            setSelectedCatagory(newInputValue.label);
          }}
          options={categories}
          sx={{ width: '100%', textTransform: 'uppercase' }}
          ListboxProps={{ style: { maxHeight: 185 } }}
          renderInput={(params) => <TextField {...params} placeholder={'Search MyCart.com'} />}
        />

        {selectedCatagory ? (
          <Box sx={{ mt: 1 }}>
            <TextField
              name={'appliedFilter'}
              value={appliedFilter}
              label={'Sort by'}
              sx={{ width: 200 }}
              onChange={(e) => {
                setAppliedFilter(e.target.value);
                handleApplyFilter(e.target.value);
              }}
              select
            >
              <MenuItem value={'price:lowtohigh'}>Price: Low to High</MenuItem>
              <MenuItem value={'price:hightolow'}>Price: High to Low</MenuItem>
              <MenuItem value={'rate:hightolow'}>Ratings</MenuItem>
            </TextField>
          </Box>
        ) : null}

        <Grid container spacing={1} sx={{ mt: 2 }}>
          {products?.map((product, index) => (
            <Grid item xs={12} md={3} key={index}>
              <ProductCard product={product} handleProductSelection={() => handleProductSelection(product)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {showProductDialog ? (
        <ProductDialog open={showProductDialog} setOpen={setShowProductDialog} selectedProduct={selectedProduct} />
      ) : null}

      <ProductCartWidget />
    </Container>
  );
};

export default Catalog;
