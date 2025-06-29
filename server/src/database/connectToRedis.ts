import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisOptions = {
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
};

export const redisClient = createClient(redisOptions);

redisClient.on('ready', () => console.log('✅ Redis connected'));
redisClient.on('error', err => console.error('❌ Redis error', err));
redisClient.on('end', () => console.log('🛑 Redis disconnected'));

(async () => {
    await redisClient.connect();
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    await redisClient.disconnect();
    process.exit(0);
});
