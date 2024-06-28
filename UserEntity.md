# USER ENTITY MODEL
### Note that the below are not final decisions and just suggestions.

The user entity has userid as its primary key. This key will be referenced as a foreign key in the FAVORITE_RESOURCES, FAVORITE_JOBS, FAVORITE_EVENTS and COMPANY_FEEDBACK tables.

The profile picture datatype is VARCHAR since it will be a URL referencing the picture stored in a static/public directory

The role attribute determines the roles of the users (user,admin,writer,reviewer...) and is user by default.

The job_title, level will be selected from a dropdown list on registration. They will reference Job_Level and Job_Category tables so they will be integers.

The headline will not be filled on registration, it can be optionally filled in the profile page.

The created_at will be automatically set upon successful registration.


 

 


