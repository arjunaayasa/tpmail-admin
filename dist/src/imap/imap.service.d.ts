import { Domain } from '@prisma/client';
export declare class ImapService {
    private logger;
    private getClient;
    fetchMessages(domain: Domain, emailAddress: string): Promise<any[]>;
    deleteMessages(domain: Domain, emailAddress: string): Promise<void>;
}
