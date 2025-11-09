import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routeController from '../../adapters/inbound/http/RouteController';
import poolController from '../../adapters/inbound/http/PoolController';
import complianceController from '../../adapters/inbound/http/ComplianceController';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


app.use('/api', routeController);

app.use('/api', complianceController);

app.get('/', (req, res) => {
  res.send('FuelEU Maritime API is running!');
});
app.use('/api', poolController);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});