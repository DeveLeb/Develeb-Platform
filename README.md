# USER ENTITY MODEL
### Note that the below are not final decisions and just suggestions.

The user entity has userid as its primary key. This key will be referenced as a foreign key in the FAVORITE_RESOURCES, FAVORITE_JOBS, FAVORITE_EVENTS and COMPANY_FEEDBACK tables.

The profile picture datatype in Postgres is BYTEA (byte array), however if the image will be stored somewhere other than the database (Cloud storage), then it can be referenced by its URL (varchar). This is optional, a default profile picture will be assigned if one was not uploaded.

The admin attribute is a boolean that is FALSE by default.

The job_role, experience_level will be selected from a dropdown list on registration.

The description will not be filled on registration, it can be optionally filled in the profile page.

The join_date will be automatically set upon successful registration.


 

 


