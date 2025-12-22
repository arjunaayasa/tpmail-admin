import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { IsOptional, IsString, MinLength } from 'class-validator';

class GenerateEmailDto {
    @IsOptional()
    @IsString()
    domain?: string; // Optional: specify domain name to use
}

class CreateEmailDto {
    @IsString()
    @MinLength(3)
    name: string;     // Required: custom name (e.g., "myemail")

    @IsOptional()
    @IsString()
    domain?: string;  // Optional: domain to use
}

@Controller('emails')
@UseGuards(ApiKeyGuard)
export class EmailsController {
    constructor(private readonly emailsService: EmailsService) { }

    @Get('domains')
    async listDomains() {
        return this.emailsService.getActiveDomains();
    }

    @Post('generate')
    async generate(@Body() dto: GenerateEmailDto) {
        return this.emailsService.generateEmail(dto.domain);
    }

    @Post('create')
    async createCustom(@Body() dto: CreateEmailDto) {
        return this.emailsService.createCustomEmail(dto.name, dto.domain);
    }
}

