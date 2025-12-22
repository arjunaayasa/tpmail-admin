import { EmailsService } from './emails.service';
declare class GenerateEmailDto {
    domain?: string;
}
declare class CreateEmailDto {
    name: string;
    domain?: string;
}
export declare class EmailsController {
    private readonly emailsService;
    constructor(emailsService: EmailsService);
    listDomains(): Promise<string[]>;
    generate(dto: GenerateEmailDto): Promise<{
        email: string;
        expires_at: Date;
    }>;
    createCustom(dto: CreateEmailDto): Promise<{
        email: string;
        expires_at: Date;
    }>;
}
export {};
