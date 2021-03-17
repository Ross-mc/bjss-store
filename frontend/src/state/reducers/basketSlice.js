import { createSlice } from '@reduxjs/toolkit';

export const basketSlice = createSlice({
    name: 'basket',
    initialState: {
        basket: [],
    },
    reducers: {
        addToBasket: (state, action) => {
            const productToAdd = state.basket.find(p => p.id === action.payload.id);
            if(productToAdd) {
                productToAdd.quantity++;
            } else {
                const newProduct = {
                    ...action.payload,
                    quantity: 1
                }
                state.basket.push(newProduct );
            }
        },
        removeFromBasket: (state, action) => {
            const productToRemove = state.basket.find(p => p.id === action.payload.id);
            productToRemove.quantity --;
            if(productToRemove.quantity < 1) {
                state.basket.splice(state.basket.indexOf(productToRemove), 1);
            }
        },
        clearBasket: (state) => { 
            state.basket = [];
        }
    }
});

export const { addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;

export const getBasketSize = basket => basket.reduce((acc, product) => acc += product.quantity, 0);

export const getTotalPrice = basket => parseFloat(basket.reduce((acc, product) => acc += product.price * product.quantity, 0)).toFixed(2);

export default basketSlice.reducer;