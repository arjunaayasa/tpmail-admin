import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminJwtGuard } from './admin-jwt.guard';
import {
    LoginDto,
    CreateDomainDto,
    UpdateDomainDto,
    CreateApiKeyDto,
    TestImapDto,
} from './dto/admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // ========== AUTH (Public) ==========
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.adminService.login(dto);
    }

    // ========== Protected Routes ==========

    @Get('stats')
    @UseGuards(AdminJwtGuard)
    async getStats() {
        return this.adminService.getStats();
    }

    // ========== DOMAINS ==========
    @Get('domains')
    @UseGuards(AdminJwtGuard)
    async getDomains() {
        return this.adminService.getDomains();
    }

    @Post('domains')
    @UseGuards(AdminJwtGuard)
    async createDomain(@Body() dto: CreateDomainDto) {
        return this.adminService.createDomain(dto);
    }

    @Patch('domains/:id')
    @UseGuards(AdminJwtGuard)
    async updateDomain(@Param('id') id: string, @Body() dto: UpdateDomainDto) {
        return this.adminService.updateDomain(id, dto);
    }

    @Delete('domains/:id')
    @UseGuards(AdminJwtGuard)
    async deleteDomain(@Param('id') id: string) {
        return this.adminService.deleteDomain(id);
    }

    // ========== API KEYS ==========
    @Get('api-keys')
    @UseGuards(AdminJwtGuard)
    async getApiKeys() {
        return this.adminService.getApiKeys();
    }

    @Post('api-keys')
    @UseGuards(AdminJwtGuard)
    async createApiKey(@Body() dto: CreateApiKeyDto) {
        return this.adminService.createApiKey(dto);
    }

    @Delete('api-keys/:id')
    @UseGuards(AdminJwtGuard)
    async deleteApiKey(@Param('id') id: string) {
        return this.adminService.deleteApiKey(id);
    }

    // ========== IMAP ==========
    @Post('imap/test')
    @UseGuards(AdminJwtGuard)
    async testImap(@Body() dto: TestImapDto) {
        return this.adminService.testImap(dto);
    }

    // ========== EMAILS ==========
    @Get('emails')
    @UseGuards(AdminJwtGuard)
    async getEmails() {
        return this.adminService.getEmails();
    }

    @Get('emails/:email/messages')
    @UseGuards(AdminJwtGuard)
    async getEmailMessages(@Param('email') email: string) {
        return this.adminService.getEmailMessages(email);
    }

    @Delete('emails/:id')
    @UseGuards(AdminJwtGuard)
    async deleteEmail(@Param('id') id: string) {
        return this.adminService.deleteEmail(id);
    }
}
