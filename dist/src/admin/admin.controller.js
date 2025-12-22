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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_jwt_guard_1 = require("./admin-jwt.guard");
const admin_dto_1 = require("./dto/admin.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async login(dto) {
        return this.adminService.login(dto);
    }
    async getStats() {
        return this.adminService.getStats();
    }
    async getDomains() {
        return this.adminService.getDomains();
    }
    async createDomain(dto) {
        return this.adminService.createDomain(dto);
    }
    async updateDomain(id, dto) {
        return this.adminService.updateDomain(id, dto);
    }
    async deleteDomain(id) {
        return this.adminService.deleteDomain(id);
    }
    async getApiKeys() {
        return this.adminService.getApiKeys();
    }
    async createApiKey(dto) {
        return this.adminService.createApiKey(dto);
    }
    async deleteApiKey(id) {
        return this.adminService.deleteApiKey(id);
    }
    async testImap(dto) {
        return this.adminService.testImap(dto);
    }
    async getEmails() {
        return this.adminService.getEmails();
    }
    async getEmailMessages(email) {
        return this.adminService.getEmailMessages(email);
    }
    async deleteEmail(id) {
        return this.adminService.deleteEmail(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('domains'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDomains", null);
__decorate([
    (0, common_1.Post)('domains'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateDomainDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDomain", null);
__decorate([
    (0, common_1.Patch)('domains/:id'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateDomainDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDomain", null);
__decorate([
    (0, common_1.Delete)('domains/:id'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDomain", null);
__decorate([
    (0, common_1.Get)('api-keys'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getApiKeys", null);
__decorate([
    (0, common_1.Post)('api-keys'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createApiKey", null);
__decorate([
    (0, common_1.Delete)('api-keys/:id'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteApiKey", null);
__decorate([
    (0, common_1.Post)('imap/test'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.TestImapDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "testImap", null);
__decorate([
    (0, common_1.Get)('emails'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEmails", null);
__decorate([
    (0, common_1.Get)('emails/:email/messages'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getEmailMessages", null);
__decorate([
    (0, common_1.Delete)('emails/:id'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteEmail", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map