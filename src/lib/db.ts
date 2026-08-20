import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const dbPath = path.join(process.cwd(), "src/data/munchfind.sqlite");

export const db = new DatabaseSync(dbPath, { readOnly: true });
