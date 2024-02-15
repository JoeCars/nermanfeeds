import { readdir } from "fs/promises";
import { join } from "path";

export async function getFiles(directoryName: string) {
	const path = join(__dirname, "..", directoryName);
	return _getFiles(path);
}

async function _getFiles(path: string) {
	let filePaths: string[] = [];

	const files = await readdir(path, { withFileTypes: true });

	for (const file of files) {
		if (file.isDirectory()) {
			filePaths = [...filePaths, ...(await _getFiles(join(path, file.name)))];
		} else if (file.name.endsWith(".js") || file.name.endsWith(".ts")) {
			filePaths.push(join(path, file.name));
		}
	}

	return filePaths;
}
