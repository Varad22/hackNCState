# 🌟 **Pack The Feed – Frontend**

This is the frontend for **Pack The Feed**, a platform dedicated to redistributing surplus food from dining halls to those in need. Built with **Next.js**, **React**, and **TailwindCSS**, it provides a seamless user experience with real-time updates and a modern UI.

---

## 🚀 **Getting Started**

### **1️⃣ Clone the Repository**
```bash
git clone <repo-url>
cd frontend
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Run the Development Server**
```bash
npm run dev
```
The app will be available at **`http://localhost:3000`**.

---

## 🏗 **Project Structure**
```
frontend/
│── public/               # Static assets (images, icons)
│── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js pages
│   ├── styles/           # Tailwind & global styles
│   ├── lib/              # API functions & utilities
│── .eslintrc.json        # Linting configuration
│── tailwind.config.js    # TailwindCSS configuration
│── next.config.js        # Next.js configuration
│── package.json          # Project dependencies & scripts
```

---

## 📦 **Dependencies**
### **Frontend Libraries**
- **`next`** – React framework for SSR & routing
- **`react` & `react-dom`** – Core React dependencies
- **`next-themes`** – Theme switching (dark mode support)
- **`tailwindcss`** – Utility-first CSS framework
- **`framer-motion`** – Smooth animations & transitions
- **`leaflet`** & **`react-leaflet`** – Interactive maps
- **`lucide-react`** – Modern SVG icons
- **`react-mouse-particles`** – Animated mouse effects
- **`clsx`** & **`tailwind-merge`** – Utility class merging

### **UI & State Management**
- **`@radix-ui/react-dialog`** – Accessible modal/dialog components
- **`@radix-ui/react-slot`** – Slot components for composition

### **Development Tools**
- **`eslint`** & **`eslint-config-next`** – Code linting
- **`postcss`** – CSS processing
- **`tailwindcss-animate`** – Extra animations for Tailwind

---

## 🎨 **Styling & UI**
The project uses **TailwindCSS** for styling, ensuring flexibility and consistency. Animations are powered by **Framer Motion** and **tailwindcss-animate**.

---

## 🔗 **Backend Proxy**
The frontend is configured to communicate with the **Flask** backend via:
```json
"proxy": "http://localhost:5000"
```
Ensure the backend is running before testing API-dependent features.

---

## 🛠 **Building for Production**
To generate a production-ready build:
```bash
npm run build
npm run start
```

