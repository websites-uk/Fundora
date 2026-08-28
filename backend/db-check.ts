import { db } from './db';

try {
  const result = await db.query('select now() as connected_at');
  console.log('Fundora database connection OK:', result.rows[0].connected_at);
} catch (error) {
  console.error('Fundora database connection failed. Check DATABASE_URL and PostgreSQL availability.');
  console.error(error);
  process.exitCode = 1;
} finally {
  await db.end();
}
