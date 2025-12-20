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
var DomainsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let DomainsService = DomainsService_1 = class DomainsService {
    prisma;
    config;
    logger = new common_1.Logger(DomainsService_1.name);
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
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
            }
            else {
                this.logger.warn('No domains found and environment variables for default domain are missing.');
            }
        }
    }
    async getActiveDomain() {
        const domain = await this.prisma.domain.findFirst({
            where: { active: true }
        });
        if (!domain) {
            throw new Error('No active domain configured');
        }
        return domain;
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = DomainsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], DomainsService);
//# sourceMappingURL=domains.service.js.map