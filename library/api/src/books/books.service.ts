import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { QueryBooksDto } from './dto/query-books.dto.js';

import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE A BOOK
  async create(createBookDto: CreateBookDto) {
    // Check whether the selected genre exists
    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });

    if (!genre) {
      throw new BadRequestException('Selected genre does not exist');
    }

    try {
      return await this.prisma.book.create({
        data: createBookDto,
        include: { genre: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A book with this ISBN already exists');
      }

      throw error;
    }
  }

  // GET ALL BOOKS WITH SEARCH, FILTERING AND PAGINATION
  async findAll(query: QueryBooksDto) {
    const {
      genreId,
      search,
      page = 1,
      limit = 10,
    } = query;

    // Build the database filter
    const where: Prisma.BookWhereInput = {};

    // Filter by genre when genreId is provided
    if (genreId !== undefined) {
      where.genreId = genreId;
    }

    // Search by book title or author
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // Retrieve matching books and count them
    const [books, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: { genre: true },
        orderBy: { id: 'asc' },
      }),

      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET ONE BOOK
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  // UPDATE A BOOK
  async update(id: number, updateBookDto: UpdateBookDto) {
    // Confirm that the book exists
    await this.findOne(id);

    // If the request includes a new genre, confirm it exists
    if (updateBookDto.genreId !== undefined) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });

      if (!genre) {
        throw new BadRequestException('Selected genre does not exist');
      }
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
        include: { genre: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A book with this ISBN already exists');
      }

      throw error;
    }
  }

  // DELETE A BOOK
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}