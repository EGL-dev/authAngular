import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express"
import * as cors from 'cors';
import * as helmet from 'helmet';


import routes from './routes';



const PORT = process.env.PORT || 3000;




import {Request, Response} from "express";

createConnection()
    .then(async => {
// create express app
const app = express();


//middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//Routes

app.use('/', routes);        



        // start express server
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
    
        });

})
.catch(error => console.log(error));
