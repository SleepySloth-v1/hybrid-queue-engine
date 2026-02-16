import app from './app';
import { env } from './config/env';
import prisma from './config/prisma';

const startServer = async (): Promise<void> => {
    try {
        // Test database connection
        await prisma.$connect();
        console.warn(`Database connected successfully`);

        // Start Express server
        app.listen(env.PORT, () => {
            console.warn(`Server running on port ${env.PORT}`);
            console.warn(`Environment: ${env.NODE_ENV}`);
            console.warn(`Health check: http://localhost:${env.PORT}/api/v1/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.warn('\nShutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.warn('\nShutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
