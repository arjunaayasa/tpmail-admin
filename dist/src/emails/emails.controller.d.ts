import { EmailsService } from './emails.service';
export declare class EmailsController {
    private readonly emailsService;
    constructor(emailsService: EmailsService);
    generate(): Promise<{
        email: string;
        expires_at: Date;
    }>;
}
