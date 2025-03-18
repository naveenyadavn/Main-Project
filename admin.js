// // Firebase Config (Same as `menu.js`)
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, onSnapshot } from "firebase/firestore";



// const firebaseConfig = {
//     apiKey: "AIzaSyDQAGsXMaF7xw2-Edsa82scqqEGGCTAZiQ",
//     authDomain: "restaurant-orders-8fd62.firebaseapp.com",
//     projectId: "restaurant-orders-8fd62",
//     storageBucket: "restaurant-orders-8fd62.firebasestorage.app",
//     messagingSenderId: "804671895076",
//     appId: "1:804671895076:web:36399f85471dde69520ab1",
//     measurementId: "G-88XSSSCFJ7"
//   };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// function fetchOrders() {
//     db.collection("orders").orderBy("timestamp", "desc").onSnapshot(snapshot => {
//         let orderList = document.getElementById("order-list");
//         orderList.innerHTML = ""; // Clear previous orders

//         snapshot.forEach(doc => {
//             let order = doc.data();
//             let listItem = document.createElement("li");
//             listItem.innerHTML = `
//                 Table ${order.tableNumber} - ₹${order.totalAmount}
//                 <button onclick="updateStatus('${doc.id}', 'Completed')">Mark as Completed</button>
//                 <button onclick="deleteOrder('${doc.id}')">Delete</button>
//             `;
//             orderList.appendChild(listItem);
//         });
//     });
// }

// fetchOrders();

// // Update Order Status
// function updateStatus(orderId, newStatus) {
//     db.collection("orders").doc(orderId).update({
//         status: newStatus
//     }).then(() => alert("Status updated!"));
// }

// // Delete Order
// function deleteOrder(orderId) {
//     db.collection("orders").doc(orderId).delete().then(() => alert("Order deleted!"));
// }
