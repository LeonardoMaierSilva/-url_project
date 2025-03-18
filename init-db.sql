IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'nestjs_db')
BEGIN
    CREATE DATABASE nestjs_db;
END
