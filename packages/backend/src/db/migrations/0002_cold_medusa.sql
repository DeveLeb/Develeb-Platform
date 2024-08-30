DO $$ 
BEGIN
    -- Drop the event_location_type table if it exists
    DROP TABLE IF EXISTS "event_location_type";

    -- Check if the location_type_id column exists in the event table
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_name = 'event' AND column_name = 'location_type_id'
    ) THEN
        -- Rename the column
        ALTER TABLE "event" RENAME COLUMN "location_type_id" TO "location_type";
        
        -- Change the data type
        ALTER TABLE "event" ALTER COLUMN "location_type" TYPE varchar(30);
    ELSE
        -- Check if the location_type column doesn't exist, then create it
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns 
            WHERE table_name = 'event' AND column_name = 'location_type'
        ) THEN
            ALTER TABLE "event" ADD COLUMN "location_type" varchar(30);
        END IF;
    END IF;

    -- Drop the constraint if it exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'event_location_type_id_event_location_type_id_fk'
        AND table_name = 'event'
    ) THEN
        ALTER TABLE "event" DROP CONSTRAINT "event_location_type_id_event_location_type_id_fk";
    END IF;
END $$;