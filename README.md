# Task Management Application

A robust and modern Task Management Application built with Next.js (App Router), TypeScript, TailwindCSS, and PostgreSQL. 

## Features

- **Authentication & Authorization**: Role-based access control with secure JWT (Manager vs. Employee).
- **Manager Portal**: 
  - Overview dashboard with real-time stats.
  - Full CRUD operations for Tasks (Assign to employees, set priorities, set due dates).
  - Employee Management (Create and delete employee accounts).
- **Employee Portal**: 
  - Personal dashboard tracking assigned and pending tasks.
  - View detailed task information.
  - Direct status updates (To Do, In Progress, Done).
- **Modern UI/UX**: Designed with Tailwind CSS and Shadcn UI components for a premium, responsive look and feel.
- **State Management**: Powered by TanStack React Query for caching, background updates, and seamless UI invalidations.
- **Robust Database**: PostgreSQL with TypeORM for reliable data modeling and automated migrations.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, Tailwind CSS, Shadcn UI, React Hook Form, Zod.
- **Backend (API Routes)**: Next.js API Routes, TypeORM, JSON Web Tokens (JWT), bcryptjs.
- **Database**: PostgreSQL.
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Quick Start (Recommended)

The easiest way to run the application is using Docker. It automatically provisions the PostgreSQL database, runs migrations, seeds initial data, and starts the Next.js application.

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed on your machine.

### Running the application

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-app
   ```

2. **Start the containers**
   ```bash
   docker-compose up --build
   ```
   *(Use `docker-compose up -d --build` to run in detached background mode)*

   > **Note:** On the first run, Docker will download the necessary images, initialize the PostgreSQL database, run TypeORM migrations, and seed the default accounts. Please wait until you see the Next.js compilation success message.

3. **Access the application**
   Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Default Credentials

The application automatically seeds a default Manager account upon initialization so you can log in immediately.

- **Email:** `manager@example.com`
- **Password:** `123456`
- **Role:** `Manager`

*(Once logged in as a Manager, you can navigate to the **Users** tab to create new Employee accounts for testing.)*

---

## 💻 Local Development (Without Docker)

If you prefer to run the application locally on your host machine, ensure you have Node.js (v20+) and PostgreSQL running.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://<your_db_user>:<your_db_password>@localhost:5432/<your_db_name>

   # JWT Secrets
   JWT_ACCESS_SECRET=your_super_secret_access_token
   JWT_REFRESH_SECRET=your_super_secret_refresh_token

   # Default Seed Data
   DEFAULT_MANAGER_NAME=Default Manager
   DEFAULT_MANAGER_EMAIL=manager@example.com
   DEFAULT_MANAGER_PASSWORD=123456
   ```

3. **Database Setup**
   Run the following commands to execute schema migrations and seed the default manager account:
   ```bash
   npm run migration:run
   npm run db:seed
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
