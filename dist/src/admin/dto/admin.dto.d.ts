export declare class LoginDto {
    email: string;
    password: string;
}
export declare class CreateDomainDto {
    domain: string;
    imap_host: string;
    imap_port: number;
    imap_user: string;
    imap_password: string;
}
export declare class UpdateDomainDto {
    domain?: string;
    imap_host?: string;
    imap_port?: number;
    imap_user?: string;
    imap_password?: string;
    active?: boolean;
}
export declare class CreateApiKeyDto {
    name: string;
}
export declare class TestImapDto {
    host: string;
    port: number;
    user: string;
    password: string;
}
export declare class CreateAdminDto {
    email: string;
    password: string;
    name?: string;
}
