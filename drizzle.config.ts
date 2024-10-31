import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: 'db.sqlite',
	},

	verbose: true,
	strict: false,
	dialect: 'sqlite'
});