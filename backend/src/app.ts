import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import centersRoutes from './modules/centers/centers.routes';
import providersRoutes from './modules/providers/providers.routes';
import servicesRoutes from './modules/services/services.routes';
import appointmentsRoutes from './modules/appointments/appointments.routes';
import queueRoutes from './modules/queue/queue.routes';

// Middleware imports
import { errorHandler } from './shared/middleware/errorHandler';

const app = express();

// ─── Global Middleware ───────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Hybrid Queue Engine API is running',
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/centers', centersRoutes);
app.use('/api/v1/providers', providersRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/appointments', appointmentsRoutes);
app.use('/api/v1/queue', queueRoutes);

// ─── 404 Handler ─────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

export default app;
