This is a small demo fullstack project for managing bugs and users.

Implemented using react + nodejs, REST, axios, formik

Deployed on render.com at: https://bug-tracker-q3tt.onrender.com
(takes some time to start up since it's hosted for free)

Features:
- CRUDL for bugs and users: See list of bugs/users, view user/bug, edit user/bug, delete user/bug
- Authentication: log in, log out, sign up
- Authorization: only admin can view user list and edit users, a user can only edit their own bug, can't delete a user with bugs, etc.
- Filter and sort users/bugs list with debounce
- Form validation (using formik)
