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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const domains_service_1 = require("../domains/domains.service");
const crypto = __importStar(require("crypto"));
let EmailsService = class EmailsService {
    prisma;
    domainsService;
    constructor(prisma, domainsService) {
        this.prisma = prisma;
        this.domainsService = domainsService;
    }
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
            if (!exists)
                break;
            attempts++;
        }
        if (attempts >= 5) {
            throw new Error('Failed to generate unique email');
        }
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
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