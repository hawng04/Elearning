# Elearning
Elearning platform with real-time contextual chat between instructor and student.

# 🎓 E-Learning Platform with Real-time Contextual Chat

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

A comprehensive E-learning platform designed with a **Strict Modular Monolith** architecture. This platform allows instructors to create and manage courses, while students can enroll, learn, and engage in **real-time contextual chat** with their instructors.

## ✨ Key Features

* **🔐 Identity & Access Management (IAM):** * Robust authentication and authorization using Spring Security and stateless JWT.
    * Role-based access control (Admin, Teacher, Student).
* **📚 Course Management:**
    * Instructors can create courses, sections, and lessons.
    * Strict security gates: Only enrolled students can access course content (videos, documents).
* **🎓 Enrollment System:**
    * Decoupled enrollment tracking for students.
* **💬 Real-Time Contextual Chat:**
    * Instant messaging between students and instructors via WebSockets.
    * Context-aware conversations (e.g., questions linked to specific lessons).

## 💻 Tech Stack

**Backend (`/elearning-backend`)**
* Java / Spring Boot 3
* Spring Security & JWT (JSON Web Tokens)
* Spring Data JPA (Relational Database mapping)
* MongoDB (For real-time chat history storage)
* WebSockets (Real-time communication)
* Lombok, MapStruct

**Frontend (`/elearning-frontend`)**
* ReactJS 
* TailwindCSS, Redux

## 🚀 Getting Started

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/hawng04/Elearning.git
cd Elearning
```   

**2. Setup Backend**
```bash
cd elearning-backend
# Cấu hình file application.properties với thông tin Database của bạn
# Chạy ứng dụng
mvn spring-boot:run
```  

**3. Setup Frontend**
```bash
cd ../elearning-frontend
npm install
npm run dev
```  
