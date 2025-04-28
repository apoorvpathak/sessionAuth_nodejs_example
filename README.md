# Session based Auth in Node.js with PostgreSQL & Prisma ORM

<p align="center">
  <img src="https://skillicons.dev/icons?i=js,nodejs,express,postgres,prisma,ejs" alt="Tech Stack Icons" />
</p>

This is a simple authentication system built with **Express.js**, **Prisma**, **bcrypt**, **express-session**, and **EJS** templating.  
It allows users to **register**, **login**, **logout**, and **protect routes** based on session authentication.

Read more at [my blog](https://www.apoorvpathak.com/blog/posts/learn-session-auth-expressjs).

## Features

- User registration with hashed passwords (`bcrypt`)
- User login and logout
- Session management with `express-session`
- Protected routes (middleware)
- Prisma ORM for database interaction
- EJS templating for frontend rendering

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / MySQL / SQLite (configurable with Prisma)
- bcrypt
- express-session
- dotenv
- EJS

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_database_connection_string"
SESSION_SECRET="your_secret_session_key"
```

Example for a local SQLite setup (Prisma):

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="supersecret"
```

### 4. Set up the Prisma schema

If you haven't already created your database and Prisma schema:

```bash
npx prisma init
```

In `prisma/schema.prisma`, define your models like:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions  Session[]
}

model Session {
  id        Int      @id @default(autoincrement())
  userId    Int
  sessionId String   @unique
  data      Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
}
```

Then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```
or
```bash
node index.js
```

Server will start on [http://localhost:3000](http://localhost:3000).

---

## Routes

| Method | Path        | Description                          |
| :----- | :---------- | :----------------------------------- |
| GET    | `/`         | Home page (protected)                |
| GET    | `/login`    | Render login form                    |
| POST   | `/login`    | Handle user login                    |
| GET    | `/logout`   | Log the user out                     |
| GET    | `/register` | Render registration form             |
| POST   | `/register` | Handle user registration             |

## Middleware

- `checkLoggedIn` - Protects routes that require a logged-in user.
- `bypassLogin` - Redirects already logged-in users away from login/register pages.

---

## Folder Structure

```bash
.
├── middlewares/
│   └── middleware.js
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   └── register.ejs
├── .env
├── prisma/
│   ├── migrations
│   └── schema.prisma
├── .gitignore
├── package-lock.json
├── package.json
├── index.js
└── README.md
```

---

## Notes

- Make sure your database is running and Prisma is properly connected.
- Always keep your `.env` file private.
- Sessions are stored in memory by default; for production, you should configure a proper session store (like Redis, a database, etc.).

---

## License

This project is open source and available under the [MIT License](LICENSE).

