import databaseDriver from "mssql";
const { ConnectionPool } = databaseDriver;
import "dotenv/config";

// Configuration for the database connection
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    idleTimeoutMillis: 30000, // How long a connection is allowed to be idle before being closed
  },
};

// Create a connection pool
const pool = new ConnectionPool(config);

/**
 * Function to run a stored procedure
 * @param {string} procedureName The name of the stored procedure
 * @param {object} params The parameters for the stored procedure
 * @returns The result of the stored procedure
 */
async function runStoredProcedure(procedureName, params = {}) {
  try {
    // Get a connection from the pool
    const connection = await pool.connect();

    // Create a new request
    const request = connection.request();

    // Set the input parameters for the stored procedure
    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });
    }

    // Execute the stored procedure
    const result = await request.execute(procedureName);

    // Release the connection back to the pool
    connection.release();

    return result.recordset;
  } catch (error) {
    // Check if the error was raised manually
    
    // Most errors will be caught by the CATCH block in the stored procedure
    // and then rethrown with RAISERROR. These errors will have errorNumber = 50000
    const errorNumber = error.number;

    // The original error message and number can be extracted from the message
    // If such error was raised, then it is a validation error that can be shown to the user
    const errorMessage = error.message?.split(" - Error Number: ");
    const originalErrorNumber = errorMessage?.at(-1);

    if (errorNumber === 50000 && originalErrorNumber === "50000") {
      // The error message will be the original error message
      throw new Error("SQL validation error", { cause: errorMessage?.at(0) });
    } else {
      // If the error was not raised manually, then it is an internal error
      throw new Error("Internal SQL error", { cause: undefined });
    }
  }
}

// Export the runStoredProcedure function
export { runStoredProcedure };
