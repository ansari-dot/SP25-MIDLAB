  import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import cookieParser from 'cookie-parser';
  import path, { dirname } from 'path';
  import { fileURLToPath } from 'url';

  // Import route files
  import connectDB from './config/db.js';
  import userRoutes from './routes/user.routes.js';
  import packageRoutes from './routes/package.routes.js';


  // Environment config
  dotenv.config();

  // Required for __dirname in ES modules
  const __filename = fileURLToPath(
      import.meta.url);
  const __dirname = dirname(__filename);

  // Create app
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middlewares
  app.use(cookieParser());
  app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Static folder to serve image files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Basic API response
  app.get('/', (req, res) => {
      res.json({
          message: "Welcome to the API"
      });
  });

  // Routes
  app.use('/api', userRoutes);
  app.use('/api', packageRoutes);


  // Start server
  const port = process.env.PORT || 2000;
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });