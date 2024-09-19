-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE "Develeb-Platform" TO "develeb-service";

-- Grant all privileges on the public schema
GRANT ALL PRIVILEGES ON SCHEMA public TO "develeb-service";

-- Set default privileges for future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO "develeb-service";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO "develeb-service";

-- Grant the CREATE privilege to allow schema creation
GRANT CREATE ON DATABASE "Develeb-Platform" TO "develeb-service";
