// create unique constraint in your graphdb, i did it directly in console

import neo4j from 'neo4j-driver';
const connectToNeo = async () => {
    // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
    const URI = process.env.NEO4J_URI;
    const USER = process.env.NEO4J_USER;
    const PASSWORD = process.env.NEO4J_PASSWORD;


    if (!URI || !USER || !PASSWORD) {
        console.log("couldnt import URI from env");
        process.exit(1);
    }


    let driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    let serverInfo;
    try {
        serverInfo = await driver.getServerInfo()
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
    console.log('Connection established')
    console.log(serverInfo)
};


export default connectToNeo;