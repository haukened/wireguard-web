import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: process.env.DB_URL || 'db.sqlite',
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite'
});
