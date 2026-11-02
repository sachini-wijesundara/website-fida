require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const migrationSql = `
-- 1. SINGLE CONSOLIDATED VISITOR SESSIONS TABLE
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'visitor_sessions')
BEGIN
    CREATE TABLE visitor_sessions (
        session_id VARCHAR(64) NOT NULL PRIMARY KEY,
        visitor_id VARCHAR(64) NOT NULL,
        ip_country NVARCHAR(100) NULL,
        ip_city NVARCHAR(100) NULL,
        device_type NVARCHAR(50) NULL,
        browser NVARCHAR(100) NULL,
        os NVARCHAR(100) NULL,
        referrer NVARCHAR(500) NULL,
        landing_page NVARCHAR(500) NULL,
        last_page NVARCHAR(500) NULL,
        page_count INT NOT NULL DEFAULT 1,
        total_duration INT NOT NULL DEFAULT 0,
        max_scroll INT NOT NULL DEFAULT 0,
        started_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        ended_at DATETIME2 NULL,
        pages_json NVARCHAR(MAX) NULL
    );

    CREATE INDEX IX_visitor_sessions_visitor_id ON visitor_sessions(visitor_id);
    CREATE INDEX IX_visitor_sessions_started_at ON visitor_sessions(started_at DESC);
    PRINT 'Created single visitor_sessions table';
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('visitor_sessions') AND name = 'last_page')
        ALTER TABLE visitor_sessions ADD last_page NVARCHAR(500) NULL;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('visitor_sessions') AND name = 'page_count')
        ALTER TABLE visitor_sessions ADD page_count INT NOT NULL DEFAULT 1;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('visitor_sessions') AND name = 'max_scroll')
        ALTER TABLE visitor_sessions ADD max_scroll INT NOT NULL DEFAULT 0;

    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('visitor_sessions') AND name = 'pages_json')
        ALTER TABLE visitor_sessions ADD pages_json NVARCHAR(MAX) NULL;

    PRINT 'visitor_sessions table verified.';
END;

-- 2. DROP REDUNDANT MULTI-TABLES IF THEY EXIST
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'section_views')
BEGIN
    DROP TABLE section_views;
    PRINT 'Dropped redundant section_views table.';
END;

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'page_views')
BEGIN
    DROP TABLE page_views;
    PRINT 'Dropped redundant page_views table.';
END;
`;

async function runMigration() {
  console.log('Connecting to SQL Server at:', config.server, config.database);
  try {
    const pool = await sql.connect(config);
    console.log('Connected! Verifying single-table tracking architecture...');
    
    await pool.request().batch(migrationSql);

    const checkTables = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME IN ('visitor_sessions', 'page_views', 'section_views')
      ORDER BY TABLE_NAME;
    `);

    console.log('Active tracking tables in database:', checkTables.recordset.map(r => r.TABLE_NAME));
    await pool.close();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
