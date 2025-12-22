import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ImapService } from '../imap/imap.service';
import { LoginDto, CreateDomainDto, UpdateDomainDto, CreateApiKeyDto, TestImapDto, CreateAdminDto } from './dto/admin.dto';
export declare class AdminService {
    private prisma;
    private jwtService;
    private imapService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, imapService: ImapService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        expires_in: number;
    }>;
    createAdmin(dto: CreateAdminDto): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
    }>;
    getStats(): Promise<{
        total_domains: number;
        active_domains: number;
        total_emails: number;
        active_emails: number;
        total_messages: number;
    }>;
    getDomains(): Promise<{
        id: string;
        domain: string;
        imap_host: string;
        imap_port: number;
        imap_user: string;
        active: boolean;
        created_at: string;
    }[]>;
    createDomain(dto: CreateDomainDto): Promise<{
        id: string;
        domain: string;
        imap_host: string;
        imap_port: number;
        imap_user: string;
        active: boolean;
        created_at: string;
    }>;
    updateDomain(id: string, dto: UpdateDomainDto): Promise<{
        id: string;
        domain: string;
        imap_host: string;
        imap_port: number;
        imap_user: string;
        active: boolean;
        created_at: string;
    }>;
    deleteDomain(id: string): Promise<{
        success: boolean;
    }>;
    getApiKeys(): Promise<{
        id: string;
        name: string;
        key: string;
        active: boolean;
        created_at: string;
        last_used: string | null;
    }[]>;
    createApiKey(dto: CreateApiKeyDto): Promise<{
        id: string;
        name: string;
        key: string;
        active: boolean;
        created_at: string;
    }>;
    deleteApiKey(id: string): Promise<{
        success: boolean;
    }>;
    testImap(dto: TestImapDto): Promise<{
        success: boolean;
        message: any;
    }>;
    getEmails(): Promise<{
        id: string;
        email: string;
        domain: string;
        status: import(".prisma/client").$Enums.EmailStatus;
        messages_count: number;
        created_at: string;
        expires_at: string;
    }[]>;
    getEmailMessages(emailAddress: string): Promise<{
        id: string;
        from: string;
        subject: string | null;
        body: string | null;
        received_at: string;
    }[]>;
    deleteEmail(id: string): Promise<{
        success: boolean;
    }>;
}
