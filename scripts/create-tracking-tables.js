require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  },
};

const migrationSql = `
-- 1. VISITOR SESSIONS TABLE
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
        started_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        ended_at DATETIME2 NULL,
        total_duration INT NOT NULL DEFAULT 0
    );

    CREATE INDEX IX_visitor_sessions_visitor_id ON visitor_sessions(visitor_id);
    CREATE INDEX IX_visitor_sessions_started_at ON visitor_sessions(started_at DESC);
    PRINT 'Created table: visitor_sessions';
END
ELSE
BEGIN
    PRINT 'Table visitor_sessions already exists.';
END;

-- 2. PAGE VIEWS TABLE
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'page_views')
BEGIN
    CREATE TABLE page_views (
        view_id VARCHAR(64) NOT NULL PRIMARY KEY,
        session_id VARCHAR(64) NOT NULL,
        page_path NVARCHAR(500) NOT NULL,
        page_title NVARCHAR(255) NULL,
        duration_seconds INT NOT NULL DEFAULT 0,
        max_scroll_percent INT NOT NULL DEFAULT 0,
        entered_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        exited_at DATETIME2 NULL,
        CONSTRAINT FK_page_views_sessions FOREIGN KEY (session_id) 
            REFERENCES visitor_sessions(session_id) ON DELETE CASCADE
    );

    CREATE INDEX IX_page_views_session_id ON page_views(session_id);
    CREATE INDEX IX_page_views_entered_at ON page_views(entered_at DESC);
    CREATE INDEX IX_page_views_page_path ON page_views(page_path);
    PRINT 'Created table: page_views';
END
ELSE
BEGIN
    PRINT 'Table page_views already exists.';
END;

-- 3. SECTION VIEWS TABLE
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'section_views')
BEGIN
    CREATE TABLE section_views (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        view_id VARCHAR(64) NOT NULL,
        section_id NVARCHAR(100) NOT NULL,
        time_visible_seconds INT NOT NULL DEFAULT 0,
        viewed_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_section_views_page_views FOREIGN KEY (view_id) 
            REFERENCES page_views(view_id) ON DELETE CASCADE
    );

    CREATE INDEX IX_section_views_view_id ON section_views(view_id);
    CREATE INDEX IX_section_views_section_id ON section_views(section_id);
    PRINT 'Created table: section_views';
END
ELSE
BEGIN
    PRINT 'Table section_views already exists.';
END;
`;

async function runMigration() {
  console.log('Connecting to SQL Server at:', config.server, config.database);
  try {
    const pool = await sql.connect(config);
    console.log('Connected! Executing schema migration...');
    
    // Execute migration
    await pool.request().batch(migrationSql);

    console.log('Migration batch finished successfully!');

    // Verify created tables
    const checkTables = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME IN ('visitor_sessions', 'page_views', 'section_views')
      ORDER BY TABLE_NAME
    `);

    console.log('Verified tables in DB:', checkTables.recordset.map(r => r.TABLE_NAME));

    // Show columns for each table
    const columns = await pool.request().query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME IN ('visitor_sessions', 'page_views', 'section_views')
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `);

    console.log('\nTable Columns:');
    let currentTable = '';
    for (const col of columns.recordset) {
      if (col.TABLE_NAME !== currentTable) {
        currentTable = col.TABLE_NAME;
        console.log(`\n--- ${currentTable} ---`);
      }
      const len = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${len} [Nullable: ${col.IS_NULLABLE}]`);
    }

    await pool.close();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
