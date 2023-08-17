# Auth Service
## Project "GoNote" - Note management system.
### Description:
Users can create, edit, search, view, and delete notes. Notes can be categorized and prioritized.

### Project Workflow
- Registering new users.
- Authenticating existing users.
- Issuing JWT tokens for access to the note service.
- The service can use Postgres to store user data.
- Service using GRPC to retrieve user data from jwt token.

### Installation
```bash
yarn install
yarn prisma generate
pre-commit install
```

## License
This project is licensed under the terms of the [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode) license.
