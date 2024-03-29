const config = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbDatabase: process.env.DB_DATABASE || 'Concerty'
};

const secretKey = "kAi3k#J@Lf0*Aal4im91rfk09m3eiLI88AL7If4mekL";

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/' + config.dbDatabase;

module.exports = {
  env: config, secretKey, dbUrl: dbUrl
};
