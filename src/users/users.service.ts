import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword
    });
  }

  findAll() {
    return this.userModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.userModel.findOne({ where: { id }, include: { all: true } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, password } = updateUserDto;
    const user = await this.findByEmail(email!);
    if (user && user.id !== id) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password!, 7);
    return this.userModel.update(
      { ...updateUserDto, password: hashedPassword }, 
      { where: { id } }
    );
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userModel.destroy({ where: { id } });
    return { 
      id: id,
      message: 'User deleted successfully' 
    };
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }
}
