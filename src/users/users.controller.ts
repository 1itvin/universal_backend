import {Body, Controller, Get, Post, UseGuards, UsePipes, Delete, Put, Param, Query} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getUsers(@Query('page') page: number, @Query('limit') limit: number) {
        return this.usersService.getAllUsers(page, limit);
    }
  
    //
    @ApiOperation({summary: 'Получить пользователя по ID'})
    @ApiResponse({status: 200, type: User})
    @Get(':id')
    getUserByID(@Param('id') id: number) {
        return this.usersService.getUserByID(id);
}

    //

    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto);
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
