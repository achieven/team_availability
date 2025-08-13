# Team Availability Management System

## 🚀 Quick Start

## 🔧 Prerequisites

- Docker and Docker Compose
    - ## Local development
    - Node.js v18+ (for development, specifically v18 to work with NestJs)
    - Redis & Couchbase can run from docker compose


```bash
# Clone the repository
git clone https://github.com/achieven/team_availability
cd team_availability

# Start the system
docker compose up -d

# wait 60 seconds for couchbase to install
```

## Credentials:
- Upon entering, you will see a button to initialize the database with the dummy data.
- After initialization it will return the list of users and teams.
- The users are essentially - a@gmail.com, b@gmail.com, ...., f@gmail.com
- the password for each user is "12345678".


## Troubleshooting
    - Couchbase not running smooth - let me know

## Local development

Backend:
- Enter backend dir: ```cd backend```
- Install: ```npm install```
- Build: ```npm run build```
- Run: ```npm start```

Frontend:
- Enter frontend dir: ```cd frontend```
- Install: ```npm install```
- Build: ```npm run build```
- Run: ```npm run dev```


## TODO:
- Frontend:
    - Hello Mr <lastname> instead of username (split to first & last name)
    - Not using common variable for api host
    - Missing pagination on team members
    - Update status is a form instead of button click
    - Flickering FE (some race conditions between components)
    - Eternal spinner when not logged in and going to /status route

- Backend:
    - ottomanjs for more readable query builder
    - server side parameter validation

## License

Using couchbase EE, only for local development.
