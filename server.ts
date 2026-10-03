import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PRIMARY_PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint for Cloud Run and container liveness probes
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function setupRoutes() {
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(distPath);

  if (process.env.NODE_ENV !== 'production' && !hasDist) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static assets
    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Run npm run build first.');
      }
    });
  }
}

function startListening(port: number) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`PlanCraft server running on http://0.0.0.0:${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE' && port !== 3000) {
      console.warn(`Port ${port} is in use (e.g. reverse proxy). Falling back to port 3000...`);
      startListening(3000);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

setupRoutes()
  .then(() => {
    startListening(PRIMARY_PORT);
  })
  .catch((err) => {
    console.error('Failed to setup server routes:', err);
    process.exit(1);
  });
