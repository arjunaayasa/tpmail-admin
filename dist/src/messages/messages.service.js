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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const imap_service_1 = require("../imap/imap.service");
const emails_service_1 = require("../emails/emails.service");
let MessagesService = class MessagesService {
    prisma;
    imapService;
    emailsService;
    constructor(prisma, imapService, emailsService) {
        this.prisma = prisma;
        this.imapService = imapService;
        this.emailsService = emailsService;
    }
    async getMessages(emailAddress) {
        const email = await this.emailsService.getEmail(emailAddress.toLowerCase());
        if (!email) {
            throw new common_1.NotFoundException('Email not found');
        }
        if (new Date() > email.expiresAt || email.status === 'EXPIRED') {
            return [];
        }
        const fetchedMessages = await this.imapService.fetchMessages(email.domain, email.email);
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        imap_service_1.ImapService,
        emails_service_1.EmailsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map