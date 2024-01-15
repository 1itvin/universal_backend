import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role;
    }

    //
    async getRoleByID(id: number) {
        const role = await this.roleRepository.findOne({where: {id}})
        return role;
    }

    async updateRole(roleId: number, updateDto: UpdateRoleDto) {
        const role = await this.roleRepository.findByPk(roleId);
        if (!role) {
          throw new HttpException(
            "Такого role не существует",
            HttpStatus.BAD_REQUEST
          );
        }
    
        role.update(updateDto);
        return role;
      }

    async getAllRoles() {
        return await this.roleRepository.findAll();
      }

      async deleteRole(roleId: number) {
        const candidate = await this.roleRepository.findOne({
          where: { id: roleId },
        });
        if (!candidate) {
          throw new HttpException(
            "Такого пользователя не существует",
            HttpStatus.BAD_REQUEST
          );
        }
        await this.roleRepository.destroy({ where: { id: roleId } });
        return { message: "Пользователь успешно удалён" };
      }
}
