require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
// const orderRoutes = require('./routes/order.routes');
// const adminRoutes = require('./routes/admin.routes');
// const sellerRoute = require('./routes/seller.routes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/seller',sellerRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// MongoDB Connection Options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// MongoDB Connection URI
const mongoURI = process.env.MONGODB_URI 

// Function to start server
const startServer = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .once('listening', () => resolve(server))
      .once('error', err => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          server.close();
          resolve(startServer(port + 1));
        } else {
          reject(err);
        }
      });
  });
};

// Connect to MongoDB and start server
mongoose
  .connect(mongoURI, mongoOptions)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Try to start server with initial port
    const initialPort = parseInt(process.env.PORT);
    const server = await startServer(initialPort);
    const actualPort = server.address().port;
    
    console.log(`Server is running on port ${actualPort}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
