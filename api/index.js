const path = require('path');
const fs = require('fs');

// Force Vercel to trace and include the Prisma schema in the serverless bundle
const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
if (fs.existsSync(schemaPath)) {
  console.log("Prisma schema traced successfully at:", schemaPath);
}

const app = require('../backend/server.js');
module.exports = app;
