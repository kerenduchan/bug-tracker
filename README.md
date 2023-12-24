# Bug Tracker

This is a small demo fullstack project for managing bugs and users.

## See it live
Deployed on render.com at: https://bug-tracker-q3tt.onrender.com
(takes some time to start up since it's hosted for free)

## Frameworks used
**Backend**: nodejs, express, REST, mongodb, mongoose
**Frontend**: react, axios, formik

## Features

### CRUDL
CRUDL for bugs, users, and comments.
- See list of bugs/users, including pagination, filtering and sorting
- View user/bug details
- Edit/delete a user/bug
- Add/edit/delete a comment on a bug

### Authentication
- sign up
- log in
- log out

### Validation
- required fields (user, bug comment)
- string field lengths (username, fullname, etc)
- number field ranges (severity, score)
- sanitization of the labels field on a bug (trimming, no duplicates, no empty labels)

### Authorization
Extensive authorization in the backend and the frontend. Detailed below.

#### User
- Viewing the list of users - can be performed only by an admin
- Viewing a user's details - can be performed only by an admin or by the user themselves
- Deleting a user - can be performed only by an admin, and only if the user has no bugs or comments associated with him.
- Editing a user - can be performed only by an admin or by the user themselves, and the admin can edit more fields than the user can.

#### Bug
- Viewing the list of bugs and a bug's details - can be performed even if not logged in.
- Creating a bug - can be performed only by a logged-in user.
- Editing/deleting a bug - can be performed only by an admin or by the user who created the bug.

#### Comment
- Viewing the list of comments for a bug - can be performed even if not logged in.
- Creating a comment - can be performed only by a logged-in user.
- Editing/deleting a comment - can be performed only by an admin or by the user who created the comment.
