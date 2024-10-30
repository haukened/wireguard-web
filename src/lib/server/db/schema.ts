import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: integer('id', {mode: 'number'}).primaryKey({autoIncrement: true}),
	username: text('username').notNull(),
	password: text('password').notNull(),
	disabled: integer('disabled', {mode: 'boolean'}).notNull().default(false),
	created_at: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', {mode: 'timestamp'}).notNull().default(sql`CURRENT_TIMESTAMP`),
	last_login: integer('last_login', {mode: 'timestamp'}),
});
