import type { Response } from 'express';
export declare class AppController {
    getHome(res: Response): void;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    getDocs(res: Response): void;
}
