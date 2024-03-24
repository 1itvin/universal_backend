import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Delete,
  Put,
  Param,
  Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Создание пользователя" })
  @ApiResponse({ status: 201, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: "Получить пользователя по ID" })
  @ApiResponse({ status: 200, type: User })
  @Get("/:id")
  getUserByID(@Param("id") id: number) {
    return this.usersService.getUserByID(id);
  }

  // @Get()
  // getUserByEmail(@Query('email') email: string) {
  //     return this.usersService.getUserByEmail(email);
  // }

  // @Get('/:email')
  // getUserByEmail(@Param('email') email: string) {
  //     return this.usersService.getUserByEmail(email);
  // }

  @ApiOperation({ summary: "Выдать роль" })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/give_role/:id")
  addRole(@Param("id") userId: number, @Body() dto: AddRoleDto) {
    return this.usersService.giveRole(userId, dto);
  }

  @ApiOperation({ summary: "Забрать роль" })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/take_role/:id")
  takeRole(@Param("id") userId: number, @Body() dto: AddRoleDto) {
    return this.usersService.takeRole(userId, dto);
  }

  @ApiOperation({ summary: "Забанить пользователя" })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/ban/:id")
  ban(@Param("id") userId: number, @Body() dto: BanUserDto) {
    return this.usersService.ban(userId, dto);
  }

  @ApiOperation({ summary: "Разбанить пользователя" })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/unban/:id")
  unban(@Param("id") userId: number) {
    return this.usersService.unban(userId);
  }

  @ApiOperation({ summary: "Удаление пользователя" })
  @ApiResponse({ status: 200, description: `Пользователь успешно удалён` })
  @Delete("/:id")
  deleteUser(@Param("id") userId: number) {
    return this.usersService.deleteUser(userId);
  }

  @ApiOperation({ summary: "Обновление пользователя" })
  @ApiResponse({ status: 200, type: User })
  @Put("/:id")
  update(@Param("id") userId: number, @Body() updateDto: UpdateUserDto) {
    return this.usersService.updateUser(userId, updateDto);
  }
}
