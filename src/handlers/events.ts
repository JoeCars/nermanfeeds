import { NermanClient, NermanEvent } from "../types";
import { getFiles } from "../utilities/handlers";

/**
 * Not currently used since we have no events.
 */
export default async function handleEvents(client: NermanClient) {
	const eventFiles = await getFiles("events");

	console.debug("handlers/events: event files.", eventFiles);

	if (eventFiles.length === 0) {
		throw new Error("No event files to load.");
	}

	eventFiles.forEach(async file => {
		try {
			const event: NermanEvent = (await import(file)).default;
			if (event.once) {
				client.once(event.name, (...args: any[]) => event.execute(...args));
			} else {
				client.on(event.name, (...args: any[]) => event.execute(...args));
			}
		} catch (error) {
			console.log(error);
		}
	});

	console.log("handlers/events: Finished registering events.");
}
