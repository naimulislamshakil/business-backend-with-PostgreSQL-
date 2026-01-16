import { app } from './app.js';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.availableParallelism();
const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	app.listen(PORT, () => {
		console.log(`Server is running port: ${PORT}`);
	});
}
