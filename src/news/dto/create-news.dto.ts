import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNewsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsBoolean()
    isPublished: boolean;

    @IsOptional()
    @IsString()
    image: Express.Multer.File;
}
