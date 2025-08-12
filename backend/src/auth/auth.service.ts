import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserDaoService } from 'src/database/dao/user-dao.service';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  type: 'user';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userDaoService: UserDaoService
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userDaoService.findUserByEmail(email);
    if (user && await this.comparePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
    };
  }

  async register(registerDto: RegisterDto) {//not unique
    const existingUser = await this.userDaoService.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const user: User = {
      id: uuidv4(),
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      type: 'user',
    };

    await this.userDaoService.insert(user);

    const { password, ...result } = user;
    return result;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT * FROM \`team_availability\`.\`_default\`.\`_default\` 
        WHERE type = "user" AND email = $email 
        LIMIT 1
      `;
      const result = await this.userDaoService.query(query, [email]);
      
      if (result.length > 0) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
}
