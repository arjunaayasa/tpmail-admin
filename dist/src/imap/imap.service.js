"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var ImapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapService = void 0;
const common_1 = require("@nestjs/common");
const imapflow_1 = require("imapflow");
const mailparser_1 = require("mailparser");
const sanitizeHtml = __importStar(require("sanitize-html"));
const crypto = __importStar(require("crypto"));
let ImapService = ImapService_1 = class ImapService {
    logger = new common_1.Logger(ImapService_1.name);
    getClient(domain) {
        return new imapflow_1.ImapFlow({
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
    async fetchMessages(domain, emailAddress) {
        const client = this.getClient(domain);
        const messages = [];
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
                for await (const message of client.fetch(searchCriteria, { source: true, envelope: true, internalDate: true })) {
                    if (!message.source)
                        continue;
                    const parsed = await (0, mailparser_1.simpleParser)(message.source);
                    const sanitize = sanitizeHtml.default || sanitizeHtml;
                    const sanitizedHtml = parsed.html ? sanitize(parsed.html, {
                        allowedTags: sanitize.defaults?.allowedTags?.concat(['img']) || ['b', 'i', 'em', 'strong', 'a'],
                    }) : null;
                    const textBody = parsed.text;
                    const body = sanitizedHtml || textBody || '';
                    const hash = crypto.createHash('md5').update(message.source).digest('hex');
                    messages.push({
                        from: parsed.from?.text || 'Unknown',
                        subject: parsed.subject || '(No Subject)',
                        receivedAt: message.internalDate,
                        body: body,
                        messageHash: hash,
                    });
                }
            }
            finally {
                lock.release();
            }
            await client.logout();
        }
        catch (e) {
            this.logger.error(`Error fetching messages for ${emailAddress}: ${e.message}`);
        }
        return messages;
    }
    async deleteMessages(domain, emailAddress) {
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
                const uids = [];
                for await (const message of client.fetch(searchCriteria, { uid: true })) {
                    uids.push(message.uid);
                }
                if (uids.length > 0) {
                    const uidString = uids.join(',');
                    await client.messageDelete(uidString, { uid: true });
                }
            }
            finally {
                lock.release();
            }
            await client.logout();
        }
        catch (e) {
            this.logger.error(`Error deleting messages for ${emailAddress}: ${e.message}`);
        }
    }
};
exports.ImapService = ImapService;
exports.ImapService = ImapService = ImapService_1 = __decorate([
    (0, common_1.Injectable)()
], ImapService);
//# sourceMappingURL=imap.service.js.map