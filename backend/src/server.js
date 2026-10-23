const  express = require("express")
const  cors = require("cors")
const  dotenv = require("dotenv")
const  transcriptionRoutes = require('./routes/transcription')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL
  })
);

app.use(express.json());

app.use('/api/transcriptions',transcriptionRoutes)

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
