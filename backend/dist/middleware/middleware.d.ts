import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                phone: string;
                is_verified: boolean;
                created_at: string;
            };
            userId?: string;
        }
    }
}
export declare const userMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=middleware.d.ts.map