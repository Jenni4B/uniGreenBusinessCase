# **GreenField Universit**  

## 📌 **Project Overview**  
This project is a **University Admin Dashboard** that provides a **secure authentication system** for different user roles:  
- **Admin**  
- **Faculty**  
- **Students**  

Users can **log in**, access their respective **dashboards**, and interact with features like **announcements and course management**. The system also ensures **session handling**, secure **two-step authentication**, and proper **logout functionality** to prevent unauthorized access.

## ⚙️ **Features & Functionality**
### 🔐 **Authentication System**
- Supports **Admin, Faculty, and Student** logins.
- Uses **hashed passwords** and **two-step verification** for extra security.
- Stores authenticated **session data** to maintain login state.

### 📝 **Announcements System**
- Admins can **post announcements** that are visible to all users.
- Uses **database queries** to fetch and display announcements in order.

### 🚪 **Logout & Security Measures**
- Users can log out **securely**, and their session is fully destroyed.
- Prevents **back button login re-entry** after logout using `Cache-Control` headers.

---

## 🛠️ **Tech Stack**
| **Technology**   | **Purpose**  |
|-----------------|-------------|
| **Node.js & Express** | Backend framework for handling authentication & sessions |
| **Sequelize & MySQL** | ORM for database management |
| **Express-Session** | Manages user sessions securely |
| **BCrypt.js** | Hashing passwords for security |
| **Bootstrap & Tailwind CSS** | UI styling for responsive design |
| **Feather Icons** | Lightweight icons for UI elements |

---

## 🚀 **Installation & Setup**
### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/Jenni4B/uniGreenBusinessCase.git
cd uniGreenBusinessCase
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```
- Run migrations to set up the database schema:
  ```bash
  npx sequelize-cli db:migrate
  ```

### 3️⃣ **Start the Application**
```bash
npm start
```
Your server will now run at **`http://localhost:3000`**.

---

## 🔑 **Usage Instructions**
### **1️⃣ Logging In**
- Visit **`http://localhost:3000/login`**.
- Select user type (**Admin, Faculty, or Student**).
- Enter email, password, and **two-step authentication code**.

### **2️⃣ Accessing the Dashboard**
- Upon successful login, users are redirected to their **dashboard**
- Each user type sees **different options** based on their permissions.

### **3️⃣ Posting Announcements (Admin)**
- Admins can post **announcements** that will be displayed on the dashboard.

### **4️⃣ Logging Out**
- Click the **"Log Out"** button.
---

## 🛠️ **Future Enhancements**
- ✅ Students sign up for courses
- ✅ Add **password reset functionality** via email.
- ✅ Allow **users to upload profile pictures**.
