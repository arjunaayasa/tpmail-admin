"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const imap_service_1 = require("../imap/imap.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let AdminService = AdminService_1 = class AdminService {
    prisma;
    jwtService;
    imapService;
    logger = new common_1.Logger(AdminService_1.name);
    constructor(prisma, jwtService, imapService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.imapService = imapService;
    }
    async login(dto) {
        const admin = await this.prisma.admin.findUnique({
            where: { email: dto.email },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await bcrypt.compare(dto.password, admin.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: admin.id, email: admin.email };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            expires_in: 3600,
        };
    }
    async createAdmin(dto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.admin.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
            },
        });
    }
    async getStats() {
        const [totalDomains, activeDomains, totalEmails, activeEmails, totalMessages] = await Promise.all([
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
    async createDomain(dto) {
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
    async updateDomain(id, dto) {
        const existing = await this.prisma.domain.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Domain not found');
        }
        const domain = await this.prisma.domain.update({
            where: { id },
            data: {
                domain: dto.domain,
                imapHost: dto.imap_host,
                imapPort: dto.imap_port,
                imapUser: dto.imap_user,
                imapPassword: dto.imap_password,
                active: dto.active,
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
    async deleteDomain(id) {
        const existing = await this.prisma.domain.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Domain not found');
        }
        await this.prisma.domain.delete({ where: { id } });
        return { success: true };
    }
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
    async createApiKey(dto) {
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
    async deleteApiKey(id) {
        const existing = await this.prisma.apiKey.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('API Key not found');
        }
        await this.prisma.apiKey.delete({ where: { id } });
        return { success: true };
    }
    async testImap(dto) {
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
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'IMAP connection failed',
            };
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        imap_service_1.ImapService])
], AdminService);
//# sourceMappingURL=admin.service.js.map