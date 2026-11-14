# Library Management System

## Project Overview

The Library Management System is a backend application designed to manage a library's book catalog using NestJS, Prisma ORM, and PostgreSQL.

The system organizes books into genres and supports different user roles, including patrons and librarians.

## Technologies Used

- **NestJS** – Backend application framework.
- **Prisma ORM** – Database modeling and management.
- **PostgreSQL** – Relational database.
- **TypeScript** – Programming language.
- **Node.js** – JavaScript runtime.

## Project Structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   └── prisma/
│   │       └── prisma.service.ts
│   ├── .env.example
│   └── package.json
└── README.md
```

## Database Models

### 1. User

The User model stores information about library users.

Fields include:
- id
- name
- email
- password
- role
- createdAt

The Role enum defines two possible user roles:

- `PATRON`: A library member.
- `LIBRARIAN`: A library staff member.

### 2. Genre

The Genre model stores book categories, such as Fiction, Science, Technology, and History.

Each genre can contain multiple books.

### 3. Book

The Book model stores information about individual books.

Fields include:
- id
- title
- author
- description
- publishedAt
- available
- genreId
- createdAt

Each book belongs to one genre through the `genreId` foreign key.

## Schema Decisions

I chose to create a separate Genre model instead of embedding genre information directly inside the Book model.

This follows relational database design principles and avoids unnecessary duplication of genre information.

For example, instead of storing the genre name repeatedly in every book record, each book stores a `genreId` that references the Genre table.

This approach provides several advantages:

1. **Data consistency:** Genre names are maintained in one place.
2. **Reduced duplication:** Multiple books can reference the same genre.
3. **Referential integrity:** The foreign key ensures that a book references an existing genre.
4. **Easy maintenance:** Updating a genre name does not require updating every associated book.

The relationship is one-to-many: one genre can have many books, while each book belongs to one genre.

## Database Setup

### 1. Install dependencies

Navigate to the API directory:

```bash
cd api
npm install
```

### 2. Configure environment variables

Create a `.env` file inside the `api` directory.

Add your PostgreSQL connection string:

```env
DATABASE_URL="your_postgresql_connection_string"
```

Use `.env.example` as a reference for the required environment variable.

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Seed the database

```bash
npx prisma db seed
```

The seed script populates the database with at least four genres and fifteen books.

### 6. Start the application

```bash
npm run start:dev
```

## Prisma vs Document Databases

One thing I found different when modeling with Prisma compared to a document database is how relationships are represented.

In Prisma with PostgreSQL, related information can be stored in separate tables and connected using foreign keys and relations.

In a document database such as MongoDB, related information can instead be embedded inside documents.

For this project, using relational models makes it easier to maintain consistent genre information and manage relationships between books and genres.

## Author

**Tambo Prince**

Junior Software Engineering Student | Frontend Developer