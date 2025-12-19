import { createApp } from "../server/app";

let app;

export default async function handler(req, res) {
    if (!app) {
        const result = await createApp();
        app = result.app;
    }
    app(req, res);
}
