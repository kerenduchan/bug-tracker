# Bug Tracker

This is a small demo fullstack project for managing bugs and users.

## See it live

Deployed on render.com at: https://bug-tracker-88ny.onrender.com/

(takes some time to start up since it's hosted for free)

Uses mongodb hosted on Atlas.

## Frameworks used

**Backend**: nodejs, express, REST, mongodb, mongoose

**Frontend**: react, axios, formik

## Features

### CRUDL

CRUDL for bugs, users, and comments.

-   See list of bugs/users, including pagination, filtering and sorting
-   View user/bug details
-   Edit/delete a user/bug
-   Add/edit/delete a comment on a bug
-   "Are you sure?" dialog confirmation before deleting a user/comment/bug

### Authentication

-   sign up
-   log in
-   log out

### Validation

-   required fields (user, bug comment)
-   string field lengths (username, fullname, etc)
-   number field ranges (severity, score)
-   sanitization of the labels field on a bug (trimming, no duplicates, no empty labels)

### Authorization

Extensive authorization in the backend and the frontend. Detailed below.

#### User

-   Viewing the list of users - can be performed only by an admin
-   Viewing a user's details - can be performed only by an admin or by the user themselves
-   Deleting a user - can be performed only by an admin, and only if the user has no bugs or comments associated with them.
-   Editing a user - can be performed only by an admin

#### Bug

-   Viewing the list of bugs and a bug's details - can be performed even if not logged in.
-   Creating a bug - can be performed only by a logged-in user.
-   Editing/deleting a bug - can be performed only by an admin or by the user who created the bug.
-   Deleting a bug deletes all of its associated comments.

#### Comment

-   Viewing the list of comments for a bug - can be performed even if not logged in.
-   Creating a comment - can be performed only by a logged-in user.
-   Editing/deleting a comment - can be performed only by an admin or by the user who created the comment.

## Ideas for future development

-   Allow an admin to edit a user's username + password and to change a user's
    role to admin/non-admin. Make sure they are not editing themselves.
-   Allow a non-admin user to edit their own username, password, full name.
    Make sure to reflect this in the current session or require to login again.
-   Show all comments (Comments index)
-   Show for each user how many comments and how many bugs they have created.
