import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
  IsISBN,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  author!: string;

  @IsString()
  @IsNotEmpty()
  @IsISBN()
  isbn!: string;

  @IsInt()
  @IsPositive()
  totalCopies!: number;

  @IsInt()
  @IsPositive()
  genreId!: number;
}