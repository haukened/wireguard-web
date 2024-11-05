import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, type InferSelectModel } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: integer('id', {mode: 'number'}).primaryKey({autoIncrement: true}),
	firstname: text('firstname').notNull(),
	lastname: text('lastname').notNull(),
	email: text('email'),
	username: text('username').notNull().unique(),
	password: text('password'),
	disabled: integer('disabled', {mode: 'boolean'}).notNull().default(false),
	created_at: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),
	updated_at: integer('updated_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),
	last_login: integer('last_login', {mode: 'timestamp'}),
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id', {mode: 'number'})
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at', {mode: 'timestamp'}).notNull(),
});

export const registrations = sqliteTable('registrations', {
	id: integer('id', {mode: 'number'}).primaryKey({autoIncrement: true}),
	userId: integer('user_id', {mode: 'number'})
		.notNull()
		.references(() => users.id),
	token: text('token').notNull(),
	created_at: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),
	consumed: integer('consumed', {mode: 'boolean'}).notNull().default(false),
	consumed_at: integer('consumed_at', {mode: 'timestamp'}),
});

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
