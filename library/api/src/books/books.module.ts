import { Module } from '@nestjs/common';

import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [BooksController],
  imports: [AuthModule],
  providers: [BooksService, PrismaService],
  exports: [BooksService],
})
export class BooksModule {}