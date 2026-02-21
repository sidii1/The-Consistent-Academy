# The Consistent Academy
https://theconsistentacademy.in/

A high-performance, visually engaging educational platform built for **The Consistent Academy**. This website is designed to showcase expert-led language courses (IELTS, TOEFL, PTE) and professional development training


## ✨ Features

* **Interactive Course Catalog:** Dynamic flowing menus and expandable cards featuring courses ranging from Corporate Survival to Kids' Grammar.
* **Seamless Test framework:** Integrated testing interfaces that allow students to evaluate their skills directly on the platform.
* **Responsive Contact System:** Integration with Firebase and Resend for seamless inquiry handling.

## 🛠️ Tech Stack

### Frontend

* **React 18** (Vite-powered)
* **TypeScript** for type-safe development
* **Tailwind CSS** for styling
* **Shadcn UI & Radix UI** for accessible, unstyled components
* **Framer Motion & GSAP** for high-end animations

### Backend & Infrastructure

* **Firebase:** Used for backend services and data management.
* **Resend:** Handles email communications and contact form submissions.
* **GoDaddy:** Domain hosting and deployment.
* **RazorPay** Payment integration

## 📂 Project Structure

```text
src/
├── components/
│   ├── layout/       # Navbar, Footer, Page Transitions
│   ├── ui/           # Reusable Neumorphic and Shadcn components
│   └── tests/        # Leadership and Grammar test interfaces
├── lib/
│   ├── firebase.ts   # Database configuration
│   └── tests/        # Mock data and test logic
├── pages/
│   ├── Index.tsx     # Hero section, Stats, and Flowing Menu
│   ├── Courses.tsx   # Detailed course listings
│   └── Tests.tsx     # Assessment landing page
└── App.tsx           # Routing and global providers

```

## ⚙️ Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/your-repo/the-consistent-academy.git

```


2. **Install dependencies:**
The project uses `bun` (as seen in `bun.lockb`) or `npm`.
```bash
npm install

```


3. **Environment Setup:**
Create a `.env` file in the root and add your Firebase and Resend API keys:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_RESEND_API_KEY=your_key

```


4. **Run the development server:**
```bash
npm run dev

```



## 📄 License

This project was developed for **The Consistent Academy**. All rights reserved.
