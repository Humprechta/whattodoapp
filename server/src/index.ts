import app from "./app"; // Import inicializované aplikace
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

 //Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`); //STARTING APP
});
