import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import { where } from "sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const candidate = await this.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email существует",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);

    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
    });
    // const role = await this.roleService.getRoleByValue("ADMIN");
    const role = await this.roleService.getRoleByValue("USER");
    await user.$set("roles", [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: { all: true },
      order: [["id", "asc"]],
    });
    // console.log("users", users);

    return users;
  }

  async getUserByID(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      include: { all: true },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  // async addRole(dto: AddRoleDto) {
  //     const user = await this.userRepository.findByPk(dto.userId);
  //     const role = await this.roleService.getRoleByValue(dto.value);
  //     if (role && user) {
  //         await user.$add('role', role.id);
  //         return dto;
  //     }
  //     throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  // }

  async giveRole(userId: number, dto: AddRoleDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: { all: true },
    });
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add("role", role.id);
      return { message: "Пользователю успешно дана новая роль" };
    }
    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async takeRole(userId: number, dto: AddRoleDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: { all: true },
    });
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$remove("role", role.id);
      await user.save();
      return { message: "У пользователю успешно удалена роль" };
    }
    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async ban(userId: number, dto: BanUserDto) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }

  async unban(userId: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
    user.banned = false;
    user.banReason = null;
    await user.save();
    return user;
  }

  async updateUser(userId: number, updateDto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new HttpException(
        "Такого пользователя не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    await user.update(updateDto);

    return user;
  }

  async deleteUser(userId: number) {
    const candidate = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!candidate) {
      throw new HttpException(
        "Такого пользователя не существует",
        HttpStatus.BAD_REQUEST
      );
    }
    await this.userRepository.destroy({ where: { id: userId } });
    return { message: "Пользователь успешно удалён" };
  }
}
