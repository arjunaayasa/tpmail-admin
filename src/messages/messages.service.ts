import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImapService } from '../imap/imap.service';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class MessagesService {
    constructor(
        private prisma: PrismaService,
        private imapService: ImapService,
        private emailsService: EmailsService,
    ) { }

    async getMessages(emailAddress: string) {
        const email = await this.emailsService.getEmail(emailAddress.toLowerCase());
        if (!email) {
            throw new NotFoundException('Email not found');
        }

        if (new Date() > email.expiresAt || email.status === 'EXPIRED') {
            return [];
        }

        // Fetch from IMAP
        const fetchedMessages = await this.imapService.fetchMessages(email.domain, email.email);

        // Save to DB
        if (fetchedMessages.length > 0) {
            const data = fetchedMessages.map(msg => ({
                emailId: email.id,
                from: msg.from,
                subject: msg.subject,
                body: msg.body,
                receivedAt: msg.receivedAt,
                messageHash: msg.messageHash,
            }));

            await this.prisma.message.createMany({
                data,
                skipDuplicates: true,
            });
        }

        // Return from DB
        const messages = await this.prisma.message.findMany({
            where: { emailId: email.id },
            orderBy: { receivedAt: 'desc' },
        });

        return messages.map(m => ({
            from: m.from,
            subject: m.subject,
            received_at: m.receivedAt,
            body: m.body
        }));
    }
}
