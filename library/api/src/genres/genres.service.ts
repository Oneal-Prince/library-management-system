
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // CREATE a genre
  async create(createGenreDto: CreateGenreDto) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { name: createGenreDto.name },
    });

    if (existingGenre) {
      throw new ConflictException('Genre already exists');
    }

    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  // FIND ALL genres
  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        books: true,
      },
    });
  }

  // FIND ONE genre
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  // UPDATE a genre
  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    if (updateGenreDto.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: { name: updateGenreDto.name },
      });

      if (existingGenre && existingGenre.id !== id) {
        throw new ConflictException('Genre name already exists');
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  // DELETE a genre
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}