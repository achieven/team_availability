import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDaoService } from 'src/database/dao/user-dao.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDaoService, AuthService],
  exports: [UserService],
})
export class StatusModule {}
