import axios from 'axios';

export const getproducts = async (category) => {
  try {
    if (category) {
      const response = await axios({
        url: `https://fakestoreapi.com/products/category/${category}`,
        method: 'GET',
      });
      return response.data;
    }
    const response = await axios({
      url: 'https://fakestoreapi.com/products',
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getcategories = async () => {
  try {
    const response = await axios({
      url: 'https://fakestoreapi.com/products/categories',
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getproduct = async (productid) => {
  try {
    const response = await axios({
      url: `https://fakestoreapi.com/products/${productid}`,
      method: 'GET',
    });
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
