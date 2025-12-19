import { createApp } from "../server/app";
import type { IncomingMessage, ServerResponse } from "http";

let app: any;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (!app) {
        const result = await createApp({ disableStatic: true });
        app = result.app;
    }
    app(req, res);
}
