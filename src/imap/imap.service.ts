import { Injectable, Logger } from '@nestjs/common';
import { Domain } from '@prisma/client';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import * as sanitizeHtml from 'sanitize-html';
import * as crypto from 'crypto';

@Injectable()
export class ImapService {
    private logger = new Logger(ImapService.name);

    private getClient(domain: Domain) {
        return new ImapFlow({
            host: domain.imapHost,
            port: domain.imapPort,
            secure: domain.imapPort === 993,
            auth: {
                user: domain.imapUser,
                pass: domain.imapPassword,
            },
            logger: false,
        });
    }

    async fetchMessages(domain: Domain, emailAddress: string) {
        const client = this.getClient(domain);
        const messages: any[] = [];

        try {
            await client.connect();
            const lock = await client.getMailboxLock('INBOX');
            try {
                const searchCriteria = {
                    or: [
                        { header: { 'Delivered-To': emailAddress } },
                        { header: { 'X-Original-To': emailAddress } },
                        { header: { 'To': emailAddress } }
                    ]
                };

                for await (const message of client.fetch(searchCriteria as any, { source: true, envelope: true, internalDate: true })) {
                    if (!message.source) continue;

                    const parsed = await simpleParser(message.source);

                    // Handle sanitizeHtml import
                    const sanitize = (sanitizeHtml as any).default || sanitizeHtml;
                    const sanitizedHtml = parsed.html ? sanitize(parsed.html, {
                        allowedTags: sanitize.defaults?.allowedTags?.concat(['img']) || ['b', 'i', 'em', 'strong', 'a'],
                    }) : null;
                    const textBody = parsed.text;

                    const body = sanitizedHtml || textBody || '';

                    const hash = crypto.createHash('md5').update(message.source as Buffer).digest('hex');

                    messages.push({
                        from: parsed.from?.text || 'Unknown',
                        subject: parsed.subject || '(No Subject)',
                        receivedAt: message.internalDate,
                        body: body,
                        messageHash: hash,
                    });
                }

            } finally {
                lock.release();
            }
            await client.logout();
        } catch (e) {
            this.logger.error(`Error fetching messages for ${emailAddress}: ${e.message}`);
        }
        return messages;
    }

    async deleteMessages(domain: Domain, emailAddress: string) {
        const client = this.getClient(domain);
        try {
            await client.connect();
            const lock = await client.getMailboxLock('INBOX');
            try {
                const searchCriteria = {
                    or: [
                        { header: { 'Delivered-To': emailAddress } },
                        { header: { 'X-Original-To': emailAddress } },
                        { header: { 'To': emailAddress } }
                    ]
                };
                const uids: number[] = [];

                for await (const message of client.fetch(searchCriteria as any, { uid: true })) {
                    uids.push(message.uid);
                }

                if (uids.length > 0) {
                    const uidString = uids.join(',');
                    await client.messageDelete(uidString, { uid: true });
                }
            } finally {
                lock.release();
            }
            await client.logout();
        } catch (e) {
            this.logger.error(`Error deleting messages for ${emailAddress}: ${e.message}`);
        }
    }
}
