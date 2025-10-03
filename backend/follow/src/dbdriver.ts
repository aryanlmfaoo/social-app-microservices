import { driver, auth } from 'neo4j-driver'

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASSWORD;


if (!URI || !USER || !PASSWORD) {
    console.log("couldnt import URI from env");
    process.exit(1);

}
const neo = driver(URI, auth.basic(USER, PASSWORD));


export default neo;