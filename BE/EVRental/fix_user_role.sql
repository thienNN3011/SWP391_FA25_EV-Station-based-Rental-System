-- Fix old USER role to RENTER
-- Run this SQL script in SQL Server Management Studio or Azure Data Studio

USE EVRental;
GO

-- Check current users with USER role
SELECT userId, username, role, status, email 
FROM users 
WHERE role = 'USER';
GO

-- Update USER to RENTER
UPDATE users 
SET role = 'RENTER' 
WHERE role = 'USER';
GO

-- Verify the update
SELECT userId, username, role, status, email 
FROM users 
WHERE role = 'RENTER';
GO

-- Show all roles in database
SELECT DISTINCT role, COUNT(*) as count
FROM users
GROUP BY role;
GO

