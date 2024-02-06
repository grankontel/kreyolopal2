import sqlite from "better-sqlite3";

console.log("Current directory:", __dirname);
console.log("Current directory:", process.cwd());

export const db = sqlite(`${process.cwd()}/../../data/sqlite.db`, { verbose: console.log });

db.exec(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);
