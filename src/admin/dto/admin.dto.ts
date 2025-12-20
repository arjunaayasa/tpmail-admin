import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class CreateDomainDto {
    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsString()
    @IsNotEmpty()
    imap_host: string;

    @IsNotEmpty()
    imap_port: number;

    @IsString()
    @IsNotEmpty()
    imap_user: string;

    @IsString()
    @IsNotEmpty()
    imap_password: string;
}

export class UpdateDomainDto {
    domain?: string;
    imap_host?: string;
    imap_port?: number;
    imap_user?: string;
    imap_password?: string;
    active?: boolean;
}

export class CreateApiKeyDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class TestImapDto {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNotEmpty()
    port: number;

    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class CreateAdminDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name?: string;
}
