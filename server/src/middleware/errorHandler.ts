import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    const status = typeof err.status === 'number' ? err.status : 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
    return;
}
