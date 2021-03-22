import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTodaysDeals,
  getProductCategories,
  getProductsForCategory,
  getProductSearch,
} from "../../mockService";

export const fetchTodaysDeals = createAsyncThunk(
  "products/fetchTodaysDeals",
  async () => getTodaysDeals()
);

export const fetchProductCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => await getProductCategories()
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ type, query }) =>
    (await type) === "category"
      ? getProductsForCategory(query)
      : getProductSearch(query)
);

export const productSlice = createSlice({
  name: "products",
  initialState: {
    todaysDeals: { status: "idle", products: [] },
    searchResults: {
      status: "idle",
      products: [],
      search: { type: "", query: "" },
    },
    categories: { status: "idle", categories: [] },
  },
  reducers: {
    loadTodaysDeals: () => {},
    search: (state, action) => {},
  },
  extraReducers: {
    [fetchTodaysDeals.pending]: (state, action) => {
      state.todaysDeals.status = "loading";
    },
    [fetchTodaysDeals.fulfilled]: (state, action) => {
      state.todaysDeals.status = "succeeded";
      state.todaysDeals.products = [...action.payload];
    },
    [fetchTodaysDeals.rejected]: (state, action) => {
      state.todaysDeals.status = "failed";
      state.todaysDeals.error = action.error.message;
    },
    [fetchProductCategories.pending]: (state, action) => {
      state.categories.status = "loading";
    },
    [fetchProductCategories.fulfilled]: (state, action) => {
      state.categories.status = "succeeded";
      state.categories.categories = [...action.payload];
    },
    [fetchProductCategories.rejected]: (state, action) => {
      state.categories.status = "failed";
      state.categories.error = action.error.message;
    },
    [fetchProducts.pending]: (state, action) => {
      const { type, query } = action.meta.arg;
      state.searchResults.search = { type, query };
      state.searchResults.status = "loading";
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.searchResults.status = "succeeded";
      state.searchResults.products = [...action.payload];
    },
    [fetchProducts.rejected]: (state, action) => {
      state.searchResults.status = "failed";
      state.searchResults.error = action.error.message;
    },
  },
});

export default productSlice.reducer;
