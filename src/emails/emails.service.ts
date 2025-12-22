import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DomainsService } from '../domains/domains.service';

// Popular first names for random email generation
const FIRST_NAMES = [
    'alex', 'anna', 'bella', 'ben', 'charlie', 'clara', 'david', 'diana',
    'emma', 'evan', 'felix', 'fiona', 'george', 'grace', 'henry', 'helen',
    'ivan', 'iris', 'jack', 'jane', 'kevin', 'kate', 'leo', 'lily',
    'max', 'maya', 'nathan', 'nina', 'oliver', 'olivia', 'peter', 'paula',
    'quinn', 'rachel', 'ryan', 'rosa', 'sam', 'sarah', 'tom', 'tina',
    'victor', 'vera', 'william', 'wendy', 'xavier', 'yuki', 'zack', 'zoe',
    'adam', 'alice', 'brian', 'carol', 'danny', 'ella', 'frank', 'gina'
];

@Injectable()
export class EmailsService {
    constructor(
        private prisma: PrismaService,
        private domainsService: DomainsService,
    ) { }

    async getActiveDomains() {
        const domains = await this.prisma.domain.findMany({
            where: { active: true },
            select: { domain: true },
            orderBy: { createdAt: 'asc' },
        });
        return domains.map(d => d.domain);
    }

    /**
     * Generate a random email with firstname + random number format
     * Example: anna123@gencutaraka.xyz
     */
    async generateEmail(domainName?: string) {
        const domain = await this.getDomain(domainName);

        let email = '';
        let attempts = 0;

        while (attempts < 10) {
            const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            const randomNum = Math.floor(100 + Math.random() * 900); // 100-999
            const alias = `${firstName}${randomNum}`;
            email = `${alias}@${domain.domain}`.toLowerCase();

            const exists = await this.prisma.email.findUnique({
                where: { email },
            });

            if (!exists) break;
            attempts++;
        }

        if (attempts >= 10) {
            throw new Error('Failed to generate unique email');
        }

        return this.createEmailRecord(email, domain.id);
    }

    /**
     * Create email with custom name
     * Example: myemail@gencutaraka.xyz
     */
    async createCustomEmail(name: string, domainName?: string) {
        // Validate name
        if (!name || name.length < 3) {
            throw new BadRequestException('Name must be at least 3 characters');
        }

        // Only allow alphanumeric and dots/underscores
        const sanitizedName = name.toLowerCase().replace(/[^a-z0-9._]/g, '');
        if (sanitizedName !== name.toLowerCase()) {
            throw new BadRequestException('Name can only contain letters, numbers, dots, and underscores');
        }

        if (sanitizedName.length < 3) {
            throw new BadRequestException('Name must be at least 3 valid characters');
        }

        const domain = await this.getDomain(domainName);
        const email = `${sanitizedName}@${domain.domain}`.toLowerCase();

        // Check if email already exists
        const exists = await this.prisma.email.findUnique({
            where: { email },
        });

        if (exists) {
            throw new ConflictException(`Email '${email}' already exists`);
        }

        return this.createEmailRecord(email, domain.id);
    }

    private async getDomain(domainName?: string) {
        let domain;

        if (domainName) {
            domain = await this.prisma.domain.findFirst({
                where: { domain: domainName, active: true },
            });
            if (!domain) {
                throw new NotFoundException(`Domain '${domainName}' not found or inactive`);
            }
        } else {
            domain = await this.domainsService.getActiveDomain();
        }

        return domain;
    }

    private async createEmailRecord(email: string, domainId: string) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const result = await this.prisma.email.create({
            data: {
                email,
                domainId,
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

