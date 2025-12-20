import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { ImapService } from '../../imap/imap.service';

@Injectable()
export class CleanupService {
    private readonly logger = new Logger(CleanupService.name);

    constructor(
        private prisma: PrismaService,
        private imapService: ImapService,
    ) { }

    @Cron('*/10 * * * *')
    async handleCleanup() {
        this.logger.log('Running cleanup cron...');

        const expiredEmails = await this.prisma.email.findMany({
            where: {
                expiresAt: { lt: new Date() },
                status: 'ACTIVE',
            },
            include: { domain: true },
        });

        if (expiredEmails.length === 0) {
            this.logger.log('No expired emails to process.');
            return;
        }

        this.logger.log(`Found ${expiredEmails.length} expired emails.`);

        for (const email of expiredEmails) {
            try {
                await this.imapService.deleteMessages(email.domain, email.email);

                await this.prisma.email.update({
                    where: { id: email.id },
                    data: { status: 'EXPIRED' },
                });

                this.logger.log(`Processed expired email: ${email.email}`);
            } catch (e) {
                this.logger.error(`Failed to process cleanup for ${email.email}: ${e.message}`);
            }
        }
    }
}
