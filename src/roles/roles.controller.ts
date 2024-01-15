import {Body, Controller, Get, Param, Post, Query, Put, Delete} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

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

    @Get('/:id')
    getRoleByID(@Param('id') id: number) {
        return this.roleService.getRoleByID(id);
    }
    
    @Put("/:id")
    update(@Param("id") roleId: number, @Body() updateDto: UpdateRoleDto) {
        return this.roleService.updateRole(roleId, updateDto);
    }

    @Delete("/:id")
    deleteUser(@Param("id") userId: number) {
        return this.roleService.deleteRole(userId);
    }
}