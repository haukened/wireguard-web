import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, type InferSelectModel } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: integer('id', {mode: 'number'}).primaryKey({autoIncrement: true}),
	firstname: text('firstname').notNull(),
	lastname: text('lastname').notNull(),
	email: text('email'),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	disabled: integer('disabled', {mode: 'boolean'}).notNull().default(false),
	created_at: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', {mode: 'timestamp'}).notNull().default(sql`CURRENT_TIMESTAMP`),
	last_login: integer('last_login', {mode: 'timestamp'}),
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id', {mode: 'number'})
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at', {mode: 'timestamp'}).notNull(),
});

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
