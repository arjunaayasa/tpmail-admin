import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('emails')
@UseGuards(ApiKeyGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get(':email/messages')
    async getMessages(@Param('email') email: string) {
        return this.messagesService.getMessages(email);
    }
}
