const Tesseract = require("tesseract.js");
const fs = require("fs");
const ncp = require("node-clipboardy");
const chokidar = require("chokidar");

let dirPath = "/Users/hamza/Desktop/Screenshots"; /*screenshot dir*/

// recognize function
const recognize = (path) => {
	Tesseract.recognize(
		path,
		"eng"
		// { logger: (m) => console.log(m) }
	).then(({ data: { text } }) => {
		console.log(text);
		ncp.writeSync(text);
		fs.unlinkSync(path);
	});
};

// folder watching service
const watchFolder = (folder) => {
	try {
		console.log(
			`[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
		);

		let watcher = chokidar.watch(folder, { persistent: true });

		watcher.on("ready", async (filePath) => {
			console.log("Ready for changes");

			watcher.on("add", async (filePath) => {
				if (filePath.includes("Screenshot")) {
					console.log(
						`[${new Date().toLocaleString()}] ${filePath} has been added.\n`
					);
					recognize(filePath);
				}
			});
		});
	} catch (error) {
		console.log(error);
	}
};

watchFolder(dirPath);
