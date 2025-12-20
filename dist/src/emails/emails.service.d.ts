import { PrismaService } from '../prisma/prisma.service';
import { DomainsService } from '../domains/domains.service';
export declare class EmailsService {
    private prisma;
    private domainsService;
    constructor(prisma: PrismaService, domainsService: DomainsService);
    generateEmail(): Promise<{
        email: string;
        expires_at: Date;
    }>;
    getEmail(email: string): Promise<({
        domain: {
            id: string;
            createdAt: Date;
            active: boolean;
            domain: string;
            imapHost: string;
            imapPort: number;
            imapUser: string;
            imapPassword: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        domainId: string;
        expiresAt: Date;
        status: import(".prisma/client").$Enums.EmailStatus;
    }) | null>;
}
