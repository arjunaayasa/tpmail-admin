import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DomainsService } from '../domains/domains.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailsService {
    constructor(
        private prisma: PrismaService,
        private domainsService: DomainsService,
    ) { }

    async generateEmail() {
        const domain = await this.domainsService.getActiveDomain();

        let email = '';
        let attempts = 0;

        while (attempts < 5) {
            const alias = crypto.randomBytes(4).toString('hex');
            email = `${alias}@${domain.domain}`.toLowerCase();

            const exists = await this.prisma.email.findUnique({
                where: { email },
            });

            if (!exists) break;
            attempts++;
        }

        if (attempts >= 5) {
            throw new Error('Failed to generate unique email');
        }

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const result = await this.prisma.email.create({
            data: {
                email,
                domainId: domain.id,
                expiresAt,
            },
        });

        return {
            email: result.email,
            expires_at: result.expiresAt,
        };
    }

    async getEmail(email: string) {
        return this.prisma.email.findUnique({ where: { email: email.toLowerCase() }, include: { domain: true } });
    }
}
