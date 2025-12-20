import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Domain } from '@prisma/client';
export declare class DomainsService implements OnModuleInit {
    private prisma;
    private config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    onModuleInit(): Promise<void>;
    seedDefaultDomain(): Promise<void>;
    getActiveDomain(): Promise<Domain>;
}
