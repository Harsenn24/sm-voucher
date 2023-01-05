const cors = require('cors')
import express, { Express } from 'express';
import dotenv from 'dotenv';
import { db } from './src/models/database.conf';
const { router } = require('./src/router/index')

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(router)

db().then(async (n:any) => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}).catch((e:any)=>{
  console.log(e)
})