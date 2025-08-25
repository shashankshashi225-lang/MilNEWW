
const { Pool } = require('pg');

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('📝 Please set up a database at:');
    console.log('   • Neon: https://neon.tech (Recommended)');
    console.log('   • Supabase: https://supabase.com');
    process.exit(1);
  }

  try {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Check if we can run a simple query
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Database time:', result.rows[0].now);
    
    client.release();
    pool.end();
    
    console.log('🚀 Database is ready for deployment!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if DATABASE_URL is correct');
    console.log('2. Ensure database allows external connections');
    console.log('3. Verify SSL settings match your provider');
    process.exit(1);
  }
}

setupDatabase();
