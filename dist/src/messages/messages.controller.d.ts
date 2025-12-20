import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getMessages(email: string): Promise<{
        from: string;
        subject: string | null;
        received_at: Date;
        body: string | null;
    }[]>;
}
