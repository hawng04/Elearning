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

## 🏗️ Architecture: Strict Modular Monolith

The backend is engineered with a deep focus on **Domain-Driven Design (DDD)** principles and high cohesion/low coupling:
* **Zero Cross-Module Foreign Keys:** Modules (IAM, Course, Enrollment, Chat) operate independently using ID references rather than direct Entity relationships (`@ManyToOne`), ensuring the system is Microservices-ready.
* **Agnostic Infrastructure:** Shared security and configuration components (`SecurityUtils`, `JwtFilter`) act as a shared kernel without depending on business domain entities.
* **Strict DTO Pattern:** Total isolation between Input (`...Request`) and Output (`...Response`) to prevent Mass Assignment vulnerabilities and ensure data integrity.

## 💻 Tech Stack

**Backend (`/elearning-backend`)**
* Java / Spring Boot 3
* Spring Security & JWT (JSON Web Tokens)
* Spring Data JPA (Relational Database mapping)
* MongoDB (For real-time chat history storage)
* WebSockets (Real-time communication)
* Lombok, MapStruct

**Frontend (`/elearning-frontend`)**
* *(Note: Cập nhật công nghệ Frontend của bạn vào đây, ví dụ: ReactJS / VueJS / Angular, TailwindCSS, Redux/Zustand...)*

## 📂 Project Structure

```text
Elearning/
├── elearning-backend/       # Spring Boot application
│   ├── src/main/java/...
│   │   ├── config/          # Global configs (Security, WebSockets, Mongo)
│   │   ├── common/          # Shared utilities
│   │   └── modules/         # Isolated business domains
│   │       ├── iam/         # User auth & management
│   │       ├── course/      # Course content (Sections, Lessons)
│   │       ├── enrollment/  # Student enrollments
│   │       └── chat/        # Real-time messaging
│   └── pom.xml
└── elearning-frontend/      # Frontend application (UI/UX)
    ├── src/
    └── package.json