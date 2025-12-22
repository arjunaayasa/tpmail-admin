"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const domains_service_1 = require("../domains/domains.service");
const FIRST_NAMES = [
    'alex', 'anna', 'bella', 'ben', 'charlie', 'clara', 'david', 'diana',
    'emma', 'evan', 'felix', 'fiona', 'george', 'grace', 'henry', 'helen',
    'ivan', 'iris', 'jack', 'jane', 'kevin', 'kate', 'leo', 'lily',
    'max', 'maya', 'nathan', 'nina', 'oliver', 'olivia', 'peter', 'paula',
    'quinn', 'rachel', 'ryan', 'rosa', 'sam', 'sarah', 'tom', 'tina',
    'victor', 'vera', 'william', 'wendy', 'xavier', 'yuki', 'zack', 'zoe',
    'adam', 'alice', 'brian', 'carol', 'danny', 'ella', 'frank', 'gina'
];
let EmailsService = class EmailsService {
    prisma;
    domainsService;
    constructor(prisma, domainsService) {
        this.prisma = prisma;
        this.domainsService = domainsService;
    }
    async getActiveDomains() {
        const domains = await this.prisma.domain.findMany({
            where: { active: true },
            select: { domain: true },
            orderBy: { createdAt: 'asc' },
        });
        return domains.map(d => d.domain);
    }
    async generateEmail(domainName) {
        const domain = await this.getDomain(domainName);
        let email = '';
        let attempts = 0;
        while (attempts < 10) {
            const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            const randomNum = Math.floor(100 + Math.random() * 900);
            const alias = `${firstName}${randomNum}`;
            email = `${alias}@${domain.domain}`.toLowerCase();
            const exists = await this.prisma.email.findUnique({
                where: { email },
            });
            if (!exists)
                break;
            attempts++;
        }
        if (attempts >= 10) {
            throw new Error('Failed to generate unique email');
        }
        return this.createEmailRecord(email, domain.id);
    }
    async createCustomEmail(name, domainName) {
        if (!name || name.length < 3) {
            throw new common_1.BadRequestException('Name must be at least 3 characters');
        }
        const sanitizedName = name.toLowerCase().replace(/[^a-z0-9._]/g, '');
        if (sanitizedName !== name.toLowerCase()) {
            throw new common_1.BadRequestException('Name can only contain letters, numbers, dots, and underscores');
        }
        if (sanitizedName.length < 3) {
            throw new common_1.BadRequestException('Name must be at least 3 valid characters');
        }
        const domain = await this.getDomain(domainName);
        const email = `${sanitizedName}@${domain.domain}`.toLowerCase();
        const exists = await this.prisma.email.findUnique({
            where: { email },
        });
        if (exists) {
            throw new common_1.ConflictException(`Email '${email}' already exists`);
        }
        return this.createEmailRecord(email, domain.id);
    }
    async getDomain(domainName) {
        let domain;
        if (domainName) {
            domain = await this.prisma.domain.findFirst({
                where: { domain: domainName, active: true },
            });
            if (!domain) {
                throw new common_1.NotFoundException(`Domain '${domainName}' not found or inactive`);
            }
        }
        else {
            domain = await this.domainsService.getActiveDomain();
        }
        return domain;
    }
    async createEmailRecord(email, domainId) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
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
    async getEmail(email) {
        return this.prisma.email.findUnique({ where: { email: email.toLowerCase() }, include: { domain: true } });
    }
};
exports.EmailsService = EmailsService;
exports.EmailsService = EmailsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        domains_service_1.DomainsService])
], EmailsService);
//# sourceMappingURL=emails.service.js.map