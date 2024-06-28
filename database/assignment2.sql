-- Task 1 from weekly Assignment 2 

-- SELECT * FROM account;

-- INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- DELETE  FROM account WHERE account_id = 1;

-- Queries: 

-- SELECT * FROM inventory;
-- SELECT * FROM classification;

-- UPDATE inventory SET inv_description = 'a huge interior' WHERE inv_id = 10;

-- SELECT inv_make, inv_model, inv_year, c.classification_name FROM inventory i
--     JOIN classification c
--     ON i.classification_id = c.classification_id
--     WHERE classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" 
-- to the middle of the file path 
-- in the inv_image and inv_thumbnail columns using a single query.

-- UPDATE inventory
-- SET
--     inv_image = REGEXP_REPLACE(inv_image, '^(/[^/]+)', '\1/vehicles'),
--     inv_thumbnail = REGEXP_REPLACE(inv_thumbnail, '^(/[^/]+)', '\1/vehicles');




