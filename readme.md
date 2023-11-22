# API GIT OTAKU 🧪

## OVERVIEW

➡️ **What is it?** See it like a mix of github and an anime/manga list website where everyone can contribute to update and add new anime/manga. Like an opensource project but for anime and manga.

## SERVICES

### # User service

An user need to have an `username`, an `email`, a `pseudo` and a `password`  
An user can't have the same `username`, `email` or `pseudo` than another user  
An `username` need to respect this format: `/^[a-z](?:[a-z]*_?[a-z]+){3,32}$/`  
An `pseudo` need to respect this format: `/^[A-Za-z0-9](?:[A-Za-z0-9]*[-_ :]?[A-Za-z0-9]+){3,32}$/`  
An user need to have a strong `password`: `/^(?=._[a-z])(?=._[A-Z])(?=._\d)(?=._[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/`

Each roles an user can have here:

- **`USER`** - The most basic role, gived when an user is created
- **`HELPER`** - Can manage `article`, like manga and anime
- **`ADMIN`** - Same as `HELPER`, but can manage users too
- **`OWNER`** - Me, can do anything

#### # Endpoints

| METHOD |        PATH        |                     DESCRIPTION                     |
| :----: | :----------------: | :-------------------------------------------------: |
|  GET   |       /users       |                                                     |
|  GET   | /users/:identifier | `identifier` can be `@me`, an `username` or an `id` |
| DELETE |   /users/:userId   |                Only can delete self                 |
| PATCH  |   /users/:userId   |      Only can update self, or need to be admin      |
|        |                    |                                                     |

#### # User model

```json
{
  "id": "2a7cd08e-ce08-406c-9450-efedb6c1dad3",
  "username": "ferret",
  "email": "example2@domain.com", // only visible for self and admin
  "pseudo": "Super ferret",
  "avatarId": null,
  "role": "USER",
  "isVerified": false, // only visible for self and admin
  "isPrivate": false,
  "createdAt": "2023-11-21T21:05:17.242Z", // only visible for admin
  "updatedAt": "2023-11-21T21:05:17.242Z" // only visible for admin
}
```

If the user is private, others can't see him (expect admin)

// TODO: REWORK ALL SCOPES
