import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class BanUserDto {
    
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;

    @ApiProperty({example: 'Флуд', description: 'Причина'})
    @IsString({message: "Должно быть строкой"})
    readonly banReason: string;
}
