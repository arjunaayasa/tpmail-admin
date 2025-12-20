import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Domain } from '@prisma/client';

@Injectable()
export class DomainsService implements OnModuleInit {
    private readonly logger = new Logger(DomainsService.name);

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) { }

    async onModuleInit() {
        await this.seedDefaultDomain();
    }

    async seedDefaultDomain() {
        const count = await this.prisma.domain.count();
        if (count === 0) {
            const domain = this.config.get('DEFAULT_DOMAIN');
            const host = this.config.get('IMAP_HOST');
            const port = this.config.get('IMAP_PORT');
            const user = this.config.get('IMAP_USER');
            const pass = this.config.get('IMAP_PASSWORD');

            if (domain && host && user && pass) {
                this.logger.log(`Seeding default domain: ${domain}`);
                await this.prisma.domain.create({
                    data: {
                        domain,
                        imapHost: host,
                        imapPort: Number(port) || 993,
                        imapUser: user,
                        imapPassword: pass,
                    },
                });
            } else {
                this.logger.warn('No domains found and environment variables for default domain are missing.');
            }
        }
    }

    async getActiveDomain(): Promise<Domain> {
        const domain = await this.prisma.domain.findFirst({
            where: { active: true }
        });
        // If no specific active one, maybe pick any? no, logic says active.
        if (!domain) {
            throw new Error('No active domain configured');
        }
        return domain;
    }
}
