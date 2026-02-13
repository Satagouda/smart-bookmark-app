# 🔖 Smart Bookmark App

A modern, realtime, secure bookmark manager built with:

- **Next.js (App Router)**
- **Supabase (Auth, PostgreSQL, Realtime, RLS)**
- **Tailwind CSS**
- **Framer Motion**
- **Deployed on Vercel**

---

## 🚀 Live Demo

👉 [https://your-vercel-url.vercel.app](https://smart-bookmark-a1ej2tnme-satagouda-patils-projects.vercel.app/)

You can log in using any Google account.

### Test Instructions

1. Login using Google OAuth
2. Add a bookmark
3. Open a second browser tab → observe realtime sync
4. Edit / Delete bookmarks
5. Toggle Dark Mode
6. Test search functionality

---

## ✨ Features

- Google OAuth authentication
- Private per-user bookmarks (RLS enforced)
- Add / Edit / Delete bookmarks
- Realtime sync across tabs
- Optimistic UI updates
- Dark mode toggle
- Favicon auto-preview
- Search functionality
- Copy link to clipboard
- Smooth animations (Framer Motion)
- Deployed on Vercel

---

## 🏗 Architecture Overview

### Frontend
- Next.js App Router
- Client components for interactivity
- Tailwind for UI styling
- Framer Motion for animations

### Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- Realtime subscriptions
- OAuth authentication

---

## 🔐 Security Implementation

Each bookmark row includes:


RLS policies enforce:  **auth.uid() = user_id**

This guarantees:

- Users can only read their own bookmarks
- Users cannot modify others’ data
- Security enforced at database level (not just frontend)

---

## 🔄 Realtime Implementation

Supabase realtime subscription:  
- postgres_changes
event: '*'
table: 'bookmarks'


This ensures instant synchronization across multiple tabs or devices.

---

## ⚡ Optimistic UI

After insert/update/delete:

- UI updates immediately
- Database confirmation happens asynchronously
- Eliminates perceived latency
- Improves user experience

---

## 🧩 Problems Faced & Solutions

### 1️⃣ OAuth Failed After Deployment

**Problem:**  
Google login failed on production.

**Cause:**  
Production domain not registered.

**Solution:**  
Added Vercel URL to:
- Supabase Auth → URL Configuration
- Google Cloud Console → Authorized Origins

---

### 2️⃣ Session Not Persisting After Refresh

**Problem:**  
User logged out on page reload.

**Solution:**  
Used:  supabase.auth.getSession()


instead of `getUser()` to restore session correctly.

---

### 3️⃣ Delete Operation Blocked by RLS

**Problem:**  
Delete failed due to missing policy.

**Solution:**  
Added delete policy:  auth.uid() = user_id


---

### 4️⃣ Bookmark Not Appearing Instantly

**Problem:**  
User needed to refresh after adding bookmark.

**Solution:**  
Implemented:
- Optimistic state update
- Supabase realtime channel

---

## 📦 Environment Variables

Configured in Vercel:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY


Environment variables are not committed to Git.

---

## 🚀 Deployment

- GitHub → Connected to Vercel
- Automatic CI/CD on push
- Production environment variables configured
- Supabase OAuth configured for production domain

---

## 🧠 Future Improvements

- Bookmark tagging system
- Pin / favorite bookmarks
- Domain grouping
- Metadata preview (OpenGraph)
- Analytics dashboard
- Keyboard shortcuts
- Pagination

---

## 👨‍💻 Author

Built by [Satagouda Patil]

---

## 📌 Tech Stack Summary

| Layer       | Technology |
|------------|------------|
| Frontend   | Next.js App Router |
| Styling    | Tailwind CSS |
| Animations | Framer Motion |
| Backend    | Supabase |
| Database   | PostgreSQL |
| Auth       | Google OAuth |
| Hosting    | Vercel |

---

## 🏁 Conclusion

This project demonstrates:

- Secure multi-user data isolation
- Realtime event-driven updates
- OAuth authentication flow
- Production deployment workflow
- Clean UI/UX implementation
- Modern full-stack architecture







