import { createSlice } from "@reduxjs/toolkit";

const getLocalStorage = () => {
  let cart = localStorage.getItem("cart");
  console.log('carttt', cart);
  if (cart) {
    return JSON.parse(cart);
  } else {
    return [];
  }
};
const initialState = {
  cart: getLocalStorage(),
  total_items: 0,
  total_amount: 0,
  shipping_fee: 100,
  cart_loading: false,
  cart_error:false,
  // cart_alert: "",
  // cart_alert_type:"",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, optionColor, amount, product } = action.payload;

      console.log('product image card ', product)
      // Generate unique identifier for each item in the cart
      const itemId = `${id}-${optionColor}`;
      // console.log('itemId', itemId)

      // Find existing item in the cart
      const existingItemIndex = state.cart.findIndex(item => item.id === itemId);
      const existingItem = state.cart[existingItemIndex];

      if (existingItem) {
        // Update existing item's amount
        const newAmount = existingItem.amount + amount;
        const updatedAmount = Math.min(newAmount, product.stock); // Ensure amount doesn't exceed stock
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = { ...existingItem, amount: updatedAmount };

        return { ...state, cart: updatedCart };
      } else {
        // Add new item to cart
        const newItem = {
          id: itemId,
          name: product.name,
          optionColor,
          amount,
          price: product.price,
          image:product.options[0]?.images[0]
        };
        return { ...state, cart: [...state.cart, newItem] };
      }
    },
    
    toggleAmount:(state, action)=>{

      const {id, value} = action.payload
console.log('action.payload', action.payload)
      const tempCart = state.cart.map((item) => {
        if (item.id === id) {
          if (value === "inc") {
            let newAmount = item.amount + 1;
            // if (newAmount > item.max) {
              // newAmount = item.max;
            // }
            return { ...item, amount: newAmount };
          }
          if (value === "dec") {
            let newAmount = item.amount - 1;
            if (newAmount < 1) {
              newAmount = 1;
            }
            return { ...item, amount: newAmount };
          }
        } else {
          return item;
        }
      });

      return { ...state, cart: tempCart };
    },

    removeItem: (state, action) => {
      const tempCart = state.cart.filter((item) => item.id !== action.payload);
    return { ...state, cart: tempCart };
    },
    clearCart: (state) => {
      localStorage.removeItem('cart');
      return { ...state, cart: [] };
    },
    countCartTotals: (state) => {
      const { total_items, total_amount } = state.cart.reduce(
        (total, cartItem) => {
          // acc: total
          // cur: cartItem
          const { amount, price } = cartItem;
  
          total.total_items += amount;
          total.total_amount += price * amount;
          return total;
          // => {total_items:56,total_amount:67}
        },
        { total_items: 0, total_amount: 0 }

      );

    return { ...state, total_items, total_amount };

    }
  },
});


export const { addToCart, toggleAmount, removeItem, clearCart, countCartTotals  } = cartSlice.actions;
export default cartSlice.reducer;
