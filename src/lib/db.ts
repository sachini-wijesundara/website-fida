import sql from 'mssql';

if (!process.env.DB_USER || !process.env.DB_SERVER) {
  console.warn("⚠️ Database environment variables are missing! Login will fail.");
}

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  requestTimeout: 60000,
  connectionTimeout: 60000,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

console.log(`📡 DB Config Initialized: Server=${config.server}, User=${config.user}, Db=${config.database}, Port=${config.port}`);

type DbGlobal = typeof globalThis & {
  __fidaSqlPoolPromise?: Promise<sql.ConnectionPool>;
};

const dbGlobal = globalThis as DbGlobal;

export const getDbConnection = async (): Promise<sql.ConnectionPool> => {
  if (dbGlobal.__fidaSqlPoolPromise) return dbGlobal.__fidaSqlPoolPromise;

  dbGlobal.__fidaSqlPoolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
      console.log('Connected to SQL Server');
      return pool;
    })
    .catch((err) => {
      delete dbGlobal.__fidaSqlPoolPromise;
      console.error('Database Connection Failed! Bad Config: ', err);
      throw err;
    });

  return dbGlobal.__fidaSqlPoolPromise;
};

export { sql };
