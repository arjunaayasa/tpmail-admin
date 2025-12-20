import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

import { EmailsModule } from '../emails/emails.module';
import { ImapModule } from '../imap/imap.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [EmailsModule, ImapModule, PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule { }
