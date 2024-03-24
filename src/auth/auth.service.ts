import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/users.model";
import { Sequelize } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private sequelize: Sequelize
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const user = await this.userService.createUser(userDto);
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    try {
      const user = await this.userService.getUserByEmail(userDto.email);

      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password
      );
      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: "Некорректный емайл или пароль",
      });
    }
  }

  async getUserFromToken(@Req() req) {
    try {
      const authHeader = req.headers.authorization;

      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException("User is not authorized");
      }

      const tokenPayload = this.jwtService.verify(token, {
        secret: "SECRET",
        // secret: process.env.PRIVATE_KEY,
      });

      const user = await this.sequelize.getRepository(User).findOne({
        where: {
          id: tokenPayload.id,
        },
        include: [
          {
            model: this.sequelize.getRepository(Role),
            as: "roles",
          },
        ],
      });

      return user;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  }
}
