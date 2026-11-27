
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create or reuse the four genres.
  const genreNames = [
    'Technology',
    'Fiction',
    'Science',
    'History',
  ];

  const genres: Record<string, number> = {};

  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    genres[name] = genre.id;
  }

  // Create or update 16 books across the four genres.
  const books = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      totalCopies: 5,
      description: 'A guide to writing readable and maintainable code.',
      genreId: genres.Technology,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt and David Thomas',
      isbn: '9780135957059',
      totalCopies: 4,
      description: 'Practical advice for software developers.',
      genreId: genres.Technology,
    },
    {
      title: 'Design Patterns',
      author: 'Erich Gamma and others',
      isbn: '9780201633610',
      totalCopies: 3,
      genreId: genres.Technology,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen and others',
      isbn: '9780262046305',
      totalCopies: 2,
      genreId: genres.Technology,
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      totalCopies: 6,
      description: 'A novel set in the Jazz Age.',
      genreId: genres.Fiction,
    },
    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      isbn: '9780385474542',
      totalCopies: 5,
      genreId: genres.Fiction,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      totalCopies: 4,
      genreId: genres.Fiction,
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      totalCopies: 3,
      genreId: genres.Fiction,
    },
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '9780553380163',
      totalCopies: 4,
      genreId: genres.Science,
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      isbn: '9780345539434',
      totalCopies: 3,
      genreId: genres.Science,
    },
    {
      title: 'The Selfish Gene',
      author: 'Richard Dawkins',
      isbn: '9780198788607',
      totalCopies: 2,
      genreId: genres.Science,
    },
    {
      title: 'Astrophysics for People in a Hurry',
      author: 'Neil deGrasse Tyson',
      isbn: '9780393609394',
      totalCopies: 5,
      genreId: genres.Science,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      totalCopies: 4,
      genreId: genres.History,
    },
    {
      title: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      isbn: '9780307594006',
      totalCopies: 3,
      genreId: genres.History,
    },
    {
      title: 'Guns, Germs, and Steel',
      author: 'Jared Diamond',
      isbn: '9780393354324',
      totalCopies: 2,
      genreId: genres.History,
    },
    {
      title: 'The Silk Roads',
      author: 'Peter Frankopan',
      isbn: '9781101912379',
      totalCopies: 3,
      genreId: genres.History,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: book,
      create: book,
    });
  }

  console.log('Seed completed successfully.');
  console.log(`Genres created or reused: ${genreNames.length}`);
  console.log(`Books created or updated: ${books.length}`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
