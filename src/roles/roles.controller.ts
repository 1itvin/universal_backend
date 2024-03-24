import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Delete,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./roles.model";

@ApiTags("Роли")
@Controller("roles")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: "Создание роли" })
  @ApiResponse({ status: 201, type: Role })
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({ summary: "Получить все роли" })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  // @Get('/:value')
  // getByValue(@Param('value') value: string) {
  //     return this.roleService.getRoleByValue(value);
  // }

  // @Get()
  // getByValue(@Query('value') value: string) {
  //     return this.roleService.getRoleByValue(value);
  // }

  @ApiOperation({ summary: "Получить роль по ID" })
  @ApiResponse({ status: 200, type: Role })
  @Get("/:id")
  getRoleByID(@Param("id") id: number) {
    return this.roleService.getRoleByID(id);
  }

  @ApiOperation({ summary: "Обновление роли" })
  @ApiResponse({ status: 200, type: Role })
  @Put("/:id")
  update(@Param("id") roleId: number, @Body() updateDto: UpdateRoleDto) {
    return this.roleService.updateRole(roleId, updateDto);
  }

  @ApiOperation({ summary: "Удаление роли" })
  @ApiResponse({ status: 200, description: `Пользователь успешно удалён` })
  @Delete("/:id")
  deleteUser(@Param("id") userId: number) {
    return this.roleService.deleteRole(userId);
  }
}
