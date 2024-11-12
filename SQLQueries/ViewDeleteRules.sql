SELECT
    tc.constraint_name,
    tc.table_name AS referencing_table,
    kcu.column_name AS referencing_column,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column,
    rc.delete_rule
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
WHERE
    tc.constraint_type = 'FOREIGN KEY' AND (ccu.table_name = 'backend_user' OR tc.table_name = 'backend_user');