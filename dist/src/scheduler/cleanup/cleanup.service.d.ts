import { PrismaService } from '../../prisma/prisma.service';
import { ImapService } from '../../imap/imap.service';
export declare class CleanupService {
    private prisma;
    private imapService;
    private readonly logger;
    constructor(prisma: PrismaService, imapService: ImapService);
    handleCleanup(): Promise<void>;
}
