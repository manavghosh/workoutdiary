import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
config({ path: '.env.local' });
const db = drizzle(process.env.DATABASE_URL!);
export {db};