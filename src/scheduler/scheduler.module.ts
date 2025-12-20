import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup/cleanup.service';

import { PrismaModule } from '../prisma/prisma.module';
import { ImapModule } from '../imap/imap.module';

@Module({
  imports: [PrismaModule, ImapModule],
  providers: [CleanupService],
})
export class SchedulerModule { }
