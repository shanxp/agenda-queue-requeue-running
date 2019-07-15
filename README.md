# Agenda queue requeue running v1.0

### Node.js script to move [Agenda](https://github.com/agenda/agenda) queue items to **"queued"** once they get stuck in **"running"** state. It can also be used as a cron job to periodically tidy up/auto correct.

### Usage:  

```bash
/usr/local/bin/node index.js <username> <password> <host/ip> <database> <auth_database> <collection> <queue_type> <minimum time in minutes> 
```
