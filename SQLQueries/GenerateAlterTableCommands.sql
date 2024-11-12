SELECT 
    'ALTER TABLE ' || tc.table_name || 
    ' DROP CONSTRAINT ' || tc.constraint_name || 
    ', ADD CONSTRAINT ' || tc.constraint_name || 
    ' FOREIGN KEY (' || kcu.column_name || ') REFERENCES ' || 
    ccu.table_name || ' (' || ccu.column_name || ') ON DELETE CASCADE;' AS alter_statement
FROM 
    information_schema.table_constraints AS tc
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN 
    information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'backend_user'
    AND rc.delete_rule != 'CASCADE';