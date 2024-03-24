import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddRoleDto {
  @ApiProperty({
    example: "ADMIN",
    description: "Название роли, которую выдать",
  })
  @IsString({ message: "Должно быть строкой" })
  readonly value: string;

  // @IsNumber({}, {message: "Должно быть числом"})
  // readonly userId: number;
}
