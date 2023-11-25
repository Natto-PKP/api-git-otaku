# Auth

Route: `/auth`

POST `/login`  
POST `/register`  
POST `/refresh`  
DELETE `/logout`

# User

Route: `/users`

GET `/` - can apply pagination and scope (if connected)  
GET `/{userId}` - can apply scope if connected  
PATCH `/{userId}` - only self update, you can update others if you're allowed to do  
DELETE `/{userId}` - only self delete

## User sanction

Route: `/users/{userId}/sanctions`

GET `/` - only self sanctions, you can see peoples sanctions if you're allowed  
GET `/{sanctionId}` - only self sanctions, you can see peoples sanctions if you're allowed  
POST `/` - only if you're allowed  
DELETE `/` - clear all user sanction, only if you're allowed  
DELETE `/{sanctionId}` - only if you're allowed  
DELETE `/{sanctionId}/cancel` - cancel a sanction without deleted it, only if you're allowed

### User sanction comment

Route: `/users/{userId}/sanctions/{sanctionId}/comments`

GET `/` - sanction comment, only for mods  
POST `/` - create a comment, only for mods
PATCH `/{commentId}` - update a comment, self only
DELETE `/{commentId}` - delete a comment, only if mod allowed
