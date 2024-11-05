# Saas-Starter-App

This project is a Todo App with a subscription-based model, but the primary purpose is to serve as a general template for building SaaS (Software-as-a-Service) applications using Next.js and Clerk. The goal is to demonstrate how to leverage modern web technologies and third-party services to develop a flexible and scalable SaaS platform.
 

## Tech Stack

- **NextJs**: A React framework for building server-rendered, static, and hybrid web applications.
- **Clerk**: A third-party authentication service that provides user management, authentication, and authorization features.
- **svix**: A tool for handling Clerk's webhooks, which are used to receive notifications about user-related events.
- **Prisma**: An ORM (Object-Relational Mapping) tool that simplifies interacting with a PostgreSQL database.
- **Shadcn**: For UI 


## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kabhinayak02/saas-starter-app
   cd saas-starter-app
    ```

2. **Install dependencies:**:
   ```bash
   npm install
    ```

3.  **Create an `.env` file in the root directory or use the `.env.sample` with your credentials**

4. **Run the development server:**
    ```bash
    npm run dev
    ```

## Features

- **Add Todo**: Users can add todos to their account. Initially, users are limited to 3 todos, but with a subscription, they can increase this limit.
- **Admin Dashboard**: An administrative dashboard for managing user subscriptions and plan details.
- **Optimized Search in Todos**: Users can search their todos with an optimized search functionality.