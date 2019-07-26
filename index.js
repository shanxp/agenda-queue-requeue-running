
const usage= 'Usage:  /usr/local/bin/node index.js <username> <password> <host/ip> <database> <auth_database> <source_collection> <queue_type> <time in minutes>';
const maxNumOfParams = 9;

if(process.argv.length < maxNumOfParams ) {
  console.error('Check parameters!');
  console.error(usage);
  process.exit(1);
}
else {
  const username = process.argv[2];
  const password = process.argv[3];
  const hostname = process.argv[4];
  const database        = process.argv[5];
  const authSource = process.argv[6];
  const originalCollection = process.argv[7];
  const queueName = process.argv[8];
  const timeInMin = parseInt(process.argv[9]) || 15;
  const nowISOStr = new Date().toISOString();
  const nowISO = new Date(nowISOStr).getTime();
  const nowISODate = new Date(nowISOStr);

  const MongoClient = require('mongodb').MongoClient;

  const mongodb = {
    username:   username,
    password:   password,
    hostname:   hostname,
    db:         database,
    authSource: authSource
  }

  const connectionString = `mongodb://${mongodb.username}:${mongodb.password}@${mongodb.hostname}/${mongodb.db}?authSource=${mongodb.authSource}`;

  // get running for more then X minutes
  const condition = {
    "name" : queueName ,
    "lockedAt" : { $ne : null }, 
    "nextRunAt" : { $eq : null } ,
    "lastModifiedBy" : { $eq : null } , 
    "lastRunAt" : { $ne : null },
    "lastRunAt" : {
      $lte: new Date(nowISO - 1000 * 60 * timeInMin)
    }
  };

  const updateClause = {
    $unset : { "failReason" : null, "failCount" : null, "failedAt": null, "lastRunAt" : null, "lastFinishedAt" : null, "lockedAt": null  },
    $set: {  "nextRunAt" : nowISODate, "lastModifiedBy": null }
  };

  ( async () => {
    try {
        const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
        const db = await client.db(database);
        const source = await db.collection(originalCollection);
        await source.updateMany(
            condition,
            updateClause
          );
    
        // console.log(condition);       
        process.exit(1);
    } catch(e) {
      console.error(e);
      process.exit(1);
    }
  })();

}