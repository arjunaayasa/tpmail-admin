import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.header('X-API-KEY');

        if (!apiKey) {
            throw new UnauthorizedException('Missing API Key');
        }

        // Check if API key exists and is active in database
        const key = await this.prisma.apiKey.findUnique({
            where: { key: apiKey },
        });

        if (!key || !key.active) {
            throw new UnauthorizedException('Invalid API Key');
        }

        // Update last used timestamp
        await this.prisma.apiKey.update({
            where: { id: key.id },
            data: { lastUsed: new Date() },
        });

        return true;
    }
}
