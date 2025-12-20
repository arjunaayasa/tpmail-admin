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
var CleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const imap_service_1 = require("../../imap/imap.service");
let CleanupService = CleanupService_1 = class CleanupService {
    prisma;
    imapService;
    logger = new common_1.Logger(CleanupService_1.name);
    constructor(prisma, imapService) {
        this.prisma = prisma;
        this.imapService = imapService;
    }
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
            }
            catch (e) {
                this.logger.error(`Failed to process cleanup for ${email.email}: ${e.message}`);
            }
        }
    }
};
exports.CleanupService = CleanupService;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleCleanup", null);
exports.CleanupService = CleanupService = CleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        imap_service_1.ImapService])
], CleanupService);
//# sourceMappingURL=cleanup.service.js.map