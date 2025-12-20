import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

import { DomainsModule } from '../domains/domains.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [DomainsModule, PrismaModule],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule { }
