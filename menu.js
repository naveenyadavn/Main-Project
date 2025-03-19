import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQAGsXMaF7xw2-Edsa82scqqEGGCTAZiQ",
  authDomain: "restaurant-orders-8fd62.firebaseapp.com",
  projectId: "restaurant-orders-8fd62",
  storageBucket: "restaurant-orders-8fd62.firebasestorage.app",
  messagingSenderId: "804671895076",
  appId: "1:804671895076:web:36399f85471dde69520ab1",
  measurementId: "G-88XSSSCFJ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  



// Initialize cart
let cart = [];
let totalAmount = 0;

// Function to update the cart count
function updateCartCount() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.item-count').textContent = `${itemCount} items Added`;
}

// Function to add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    totalAmount += price;
    updateCartCount();
}

// Function to remove item from cart
function removeFromCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity -= 1;
        if (existingItem.quantity === 0) {
            cart = cart.filter(item => item.name !== name);
        }
        totalAmount -= price;
        updateCartCount();
    }
}


function updateButton(button, count) {
    if (count > 0) {
        button.innerHTML = `
            <span class="minus">-</span>
            <span class="count">${count}</span>
            <span class="plus">+</span>
        `;
        button.classList.add('count-mode');

        // Add event listeners for + and -
        const minusButton = button.querySelector('.minus');
        const plusButton = button.querySelector('.plus');

        // Remove existing event listeners to avoid duplication
        minusButton.replaceWith(minusButton.cloneNode(true));
        plusButton.replaceWith(plusButton.cloneNode(true));

        // Add new event listeners
        button.querySelector('.minus').addEventListener('click', (e) => {
            e.stopPropagation();
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            removeFromCart(name, price);
            const item = cart.find(item => item.name === name);
            updateButton(button, item ? item.quantity : 0);
        });

        button.querySelector('.plus').addEventListener('click', (e) => {
            e.stopPropagation();
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            addToCart(name, price);
            const item = cart.find(item => item.name === name);
            updateButton(button, item.quantity);
        });
    } else {
        button.innerHTML = 'ADD';
        button.classList.remove('count-mode');
    }
}

// Event listeners for "ADD" buttons
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));
        addToCart(name, price);
        const item = cart.find(item => item.name === name);
        updateButton(button, item.quantity);
    });
});

// Function to display cart items in the modal
function displayCart() {
    const cartList = document.querySelector('.cart-list');
    const totalAmountElement = document.querySelector('.total-amount');
    cartList.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>₹${item.price * item.quantity}</span>
        `;
        cartList.appendChild(cartItem);
    });

    totalAmountElement.textContent = totalAmount;
    document.querySelector('.cart-modal').style.display = 'flex';
}

// Function to close the cart modal
function closeCartModal() {
    document.querySelector('.cart-modal').style.display = 'none';
}

// Event listener for "VIEW CART" button
document.querySelector('.view-cart').addEventListener('click', displayCart);

// Event listener for "Close" button in the cart modal
document.querySelector('.close-cart').addEventListener('click', closeCartModal);






import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
const db = getFirestore(app);


// Event listener for "PLACE ORDER" button
document.querySelector('.place-order').addEventListener('click', () => {
    const tableNumber = document.getElementById('table-number').value;

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to place an order.');
    } else if (!tableNumber) {
        alert('Please enter a table number.');
    } else {
        // Save the order to Firestore
        const order = {
            tableNumber: parseInt(tableNumber),
            items: [...cart], // Copy the cart items
            totalAmount: totalAmount,
            status: 'Pending', // Order status
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add timestamp
        };



        addDoc(collection(db, "orders"), {
        tableNumber: parseInt(tableNumber),
        items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
         })),
        totalAmount: totalAmount,
        status: "Pending",
       timestamp: serverTimestamp()
       }).then(() => {
       alert(`Order placed successfully for Table ${tableNumber}!`);
     cart = [];
    totalAmount = 0;
    updateCartCount();
    closeCartModal();
    document.querySelectorAll('.add-btn').forEach(button => updateButton(button, 0));
    })
    .catch(error => {
    console.error("Error placing order:", error);
   });


        
    }
});
