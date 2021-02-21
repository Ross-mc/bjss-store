import { configureStore } from '@reduxjs/toolkit'
import basketReducer from './reducers/basketSlice';
import productReducer from './reducers/productSlice';

export default configureStore({
    reducer: {
      basket: basketReducer,
      products: productReducer
    }
  });