require("dotenv").config();
const cors = require("cors");
const express = require("express");
const compression = require('compression');
const port = process.env.PORT || 8080;
const app = express();

const Routes = require("./src/routes/index");
const {limiter} = require("./src/middlewares/rateLimiter")


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [`http://localhost:${port}`]; // Replace with your specific URL if needed

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
  maxAge: 600, // Cache preflight for 10 minutes
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//allow form data
app.use(express.json({ limit: "1005mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("API working fine");
});

// Enable compression middleware for optimized response
app.use(compression());

// Rate Limiter Middleware
app.use(limiter);

app.use('/api/v1', Routes)

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
    // Optionally include more details like requested URL
    requestedUrl: req.originalUrl,
  });
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(500).json({
      result: -2,
      status: 500,
      error: err,
      msg: "File size exceeds the allowed limit",
    });
  }

  return res.status(500).json({
    result: -2,
    status: 500,
    error: err,
    msg: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
