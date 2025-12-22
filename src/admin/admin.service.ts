import { Injectable, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ImapService } from '../imap/imap.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
    LoginDto,
    CreateDomainDto,
    UpdateDomainDto,
    CreateApiKeyDto,
    TestImapDto,
    CreateAdminDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private imapService: ImapService,
    ) { }

    // ========== AUTH ==========
    async login(dto: LoginDto) {
        const admin = await this.prisma.admin.findUnique({
            where: { email: dto.email },
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(dto.password, admin.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: admin.id, email: admin.email };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            expires_in: 3600,
        };
    }

    async createAdmin(dto: CreateAdminDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.admin.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
            },
        });
    }

    // ========== STATS ==========
    async getStats() {
        const [totalDomains, activeDomains, totalEmails, activeEmails, totalMessages] =
            await Promise.all([
                this.prisma.domain.count(),
                this.prisma.domain.count({ where: { active: true } }),
                this.prisma.email.count(),
                this.prisma.email.count({ where: { status: 'ACTIVE' } }),
                this.prisma.message.count(),
            ]);

        return {
            total_domains: totalDomains,
            active_domains: activeDomains,
            total_emails: totalEmails,
            active_emails: activeEmails,
            total_messages: totalMessages,
        };
    }

    // ========== DOMAINS ==========
    async getDomains() {
        const domains = await this.prisma.domain.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return domains.map(d => ({
            id: d.id,
            domain: d.domain,
            imap_host: d.imapHost,
            imap_port: d.imapPort,
            imap_user: d.imapUser,
            active: d.active,
            created_at: d.createdAt.toISOString(),
        }));
    }

    async createDomain(dto: CreateDomainDto) {
        const domain = await this.prisma.domain.create({
            data: {
                domain: dto.domain,
                imapHost: dto.imap_host,
                imapPort: dto.imap_port,
                imapUser: dto.imap_user,
                imapPassword: dto.imap_password,
            },
        });

        return {
            id: domain.id,
            domain: domain.domain,
            imap_host: domain.imapHost,
            imap_port: domain.imapPort,
            imap_user: domain.imapUser,
            active: domain.active,
            created_at: domain.createdAt.toISOString(),
        };
    }

    async updateDomain(id: string, dto: UpdateDomainDto) {
        const existing = await this.prisma.domain.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Domain not found');
        }

        // Build update data, excluding undefined values
        const updateData: Record<string, unknown> = {};
        if (dto.domain !== undefined) updateData.domain = dto.domain;
        if (dto.imap_host !== undefined) updateData.imapHost = dto.imap_host;
        if (dto.imap_port !== undefined) updateData.imapPort = dto.imap_port;
        if (dto.imap_user !== undefined) updateData.imapUser = dto.imap_user;
        if (dto.imap_password !== undefined) updateData.imapPassword = dto.imap_password;
        if (dto.active !== undefined) updateData.active = dto.active;

        const domain = await this.prisma.domain.update({
            where: { id },
            data: updateData,
        });

        return {
            id: domain.id,
            domain: domain.domain,
            imap_host: domain.imapHost,
            imap_port: domain.imapPort,
            imap_user: domain.imapUser,
            active: domain.active,
            created_at: domain.createdAt.toISOString(),
        };
    }

    async deleteDomain(id: string) {
        const existing = await this.prisma.domain.findUnique({
            where: { id },
            include: { emails: { take: 1 } }
        });
        if (!existing) {
            throw new NotFoundException('Domain not found');
        }

        // Check if domain has related emails
        if (existing.emails.length > 0) {
            // Delete all related emails and their messages first
            await this.prisma.message.deleteMany({
                where: { email: { domainId: id } }
            });
            await this.prisma.email.deleteMany({
                where: { domainId: id }
            });
        }

        await this.prisma.domain.delete({ where: { id } });
        return { success: true };
    }

    // ========== API KEYS ==========
    async getApiKeys() {
        const keys = await this.prisma.apiKey.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return keys.map(k => ({
            id: k.id,
            name: k.name,
            key: k.key.slice(0, 8) + '...',
            active: k.active,
            created_at: k.createdAt.toISOString(),
            last_used: k.lastUsed?.toISOString() || null,
        }));
    }

    async createApiKey(dto: CreateApiKeyDto) {
        const key = `mk_${crypto.randomBytes(24).toString('hex')}`;

        const apiKey = await this.prisma.apiKey.create({
            data: {
                name: dto.name,
                key,
            },
        });

        return {
            id: apiKey.id,
            name: apiKey.name,
            key: apiKey.key,
            active: apiKey.active,
            created_at: apiKey.createdAt.toISOString(),
        };
    }

    async deleteApiKey(id: string) {
        const existing = await this.prisma.apiKey.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('API Key not found');
        }

        await this.prisma.apiKey.delete({ where: { id } });
        return { success: true };
    }

    // ========== IMAP TEST ==========
    async testImap(dto: TestImapDto) {
        try {
            const mockDomain = {
                id: 'test',
                domain: 'test',
                imapHost: dto.host,
                imapPort: dto.port,
                imapUser: dto.user,
                imapPassword: dto.password,
                active: true,
                createdAt: new Date(),
            };

            await this.imapService.fetchMessages(mockDomain, 'test@test.com');

            return {
                success: true,
                message: 'IMAP connection successful',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'IMAP connection failed',
            };
        }
    }

    // ========== EMAILS ==========
    async getEmails() {
        const emails = await this.prisma.email.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                domain: { select: { domain: true } },
                _count: { select: { messages: true } },
            },
        });

        return emails.map(e => ({
            id: e.id,
            email: e.email,
            domain: e.domain.domain,
            status: e.status,
            messages_count: e._count.messages,
            created_at: e.createdAt.toISOString(),
            expires_at: e.expiresAt.toISOString(),
        }));
    }

    async getEmailMessages(emailAddress: string) {
        const email = await this.prisma.email.findUnique({
            where: { email: emailAddress.toLowerCase() },
            include: {
                messages: {
                    orderBy: { receivedAt: 'desc' },
                },
            },
        });

        if (!email) {
            throw new NotFoundException('Email not found');
        }

        return email.messages.map(m => ({
            id: m.id,
            from: m.from,
            subject: m.subject,
            body: m.body,
            received_at: m.receivedAt.toISOString(),
        }));
    }

    async deleteEmail(id: string) {
        const existing = await this.prisma.email.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Email not found');
        }

        // Messages will be deleted by cascade
        await this.prisma.email.delete({ where: { id } });
        return { success: true };
    }
}
