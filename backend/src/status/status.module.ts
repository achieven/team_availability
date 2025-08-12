import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { UserDaoService } from 'src/database/dao/user-dao.service';

@Module({
  controllers: [StatusController],
  providers: [StatusService, UserDaoService],
  exports: [StatusService],
})
export class StatusModule {}
