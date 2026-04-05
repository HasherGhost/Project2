# 🍽️ SmartCanteen

> Your campus dining, reimagined

SmartCanteen is a modern, comprehensive **Student Canteen Pre-Order & Management System** built to optimize campus dining operations. Featuring a sleek **glassmorphism** UI, dynamic seat tracking, and specialized portals for Students, Staff, and Administrators. 

## 🌟 Key Features

### 🎓 Student Portal
- **Pre-order Meals**: Browse the daily menu with categories (Snacks, Meals, Beverages, Desserts).
- **Cart & Checkout**: Manage cart and pay via Wallet, Online (UPI), or Offline (Pay at Counter with a strict 10-minute deadline).
- **Order Tracking**: Track live status of orders (Pending, Under Preparation, Ready to Collect, Delivered).
- **Seating Availability**: Check real-time seat availability in the cafe before arriving.
- **Smart Wallet**: Add and manage virtual funds via the built-in wallet system.

### 👨‍🍳 Staff Portal
- **Order Management**: Monitor incoming orders and update statuses across the preparation lifecycle.
- **Menu Availability**: Toggle real-time availability of items (in case of stock outs).

### 🛡️ Admin Portal
- **Analytics Dashboard**: Rich visual insights covering stats like total revenue, average order value, popular items (Pie Chart), and order timeline (Bar Chart).
- **Menu Management**: Full control to add new dishes complete with names, prices, emojis, and categories.

## 🎨 Design & UI/UX
The application relies on exceptional, custom-built 2D design aesthetics to elevate the user experience.
- **Glassmorphism**: Elegant translucent panels over animated background gradients.
- **Animations & Transitions**: Fluid screen transitions, pulse effects, and responsive interactions.
- **Modern Typography**: Utilizing 'Inter' for crisp readability.
- **Dark Mode Nuances**: Curated dark palettes featuring deep purples, slate, and vibrant accent colors.

## 🛠️ Tech Stack
- **Frontend Core**: Vanilla HTML5, CSS3, ES6 JavaScript.
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) for beautiful, responsive admin charts.
- **Icons**: [FontAwesome 6.5.1](https://fontawesome.com/)
- **Fonts**: [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

## 🚀 Getting Started

Simply open or serve the `index.html` file using any modern web browser or local development server.

```bash
# Example using an HTTP server for local serving
npx serve .
```

*Note: The current version uses local in-memory storage simulating database capabilities. Reloading the page will reset orders and application states.*

## 📂 Project Structure

- `index.html`: Main shell of the application containing layouts for all portals and models.
- `styles.css`: Complete styling rules including CSS variables, animations, and responsive design.
- `app.js`: Application logic featuring simulated state management, UI rendering, portal switching, and timers.

---
*Developed with ♥ for seamless campus dining.*
