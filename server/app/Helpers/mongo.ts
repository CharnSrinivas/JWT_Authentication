import { MongoClient, Db } from 'mongodb';

const url = "mongodb+srv://charansrinivas:charansrinivas@ecommerceapp.o1vye.mongodb.net/EcommerceApp?retryWrites=true&w=majority";
const DB_Name = 'EcommerceApp';


export default class MongoHelper {
    public static client: MongoClient | undefined;
    public static db: Db | undefined;


    public static async connectDb(db_name?: string): Promise<boolean | Db> {
        return new Promise((resolve, reject) => {
            try {
                const mongo_client = new MongoClient(url!);
                mongo_client.connect()
                    .then((client) => {
                        this.client = client;
                        console.log('Connected successfully to server');
                        this.db = this.client.db(db_name ? db_name : DB_Name);
                        resolve(this.db);
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(false);
                    })

            } catch (error) {
                console.error(error)
                reject(false);
            }

        })

    }

}

