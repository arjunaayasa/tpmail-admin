import { PrismaService } from '../prisma/prisma.service';
import { ImapService } from '../imap/imap.service';
import { EmailsService } from '../emails/emails.service';
export declare class MessagesService {
    private prisma;
    private imapService;
    private emailsService;
    constructor(prisma: PrismaService, imapService: ImapService, emailsService: EmailsService);
    getMessages(emailAddress: string): Promise<{
        from: string;
        subject: string | null;
        received_at: Date;
        body: string | null;
    }[]>;
}
