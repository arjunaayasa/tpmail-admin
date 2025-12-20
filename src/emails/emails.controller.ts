import { Controller, Post, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('emails')
@UseGuards(ApiKeyGuard)
export class EmailsController {
    constructor(private readonly emailsService: EmailsService) { }

    @Post('generate')
    async generate() {
        return this.emailsService.generateEmail();
    }
}
