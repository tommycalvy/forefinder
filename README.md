###### ForeFinder is a golf community web application where golfers can find other golfers.

# ForeFinder Web Application MVP v1

#### Functional Requirements

- **User Authentication**
    - Create account
    - Login
    - Verify email
    - Change account settings
    - First name, last name, email, or password
    - Recover account from lost password
    - Logout
- **Create a golf profile**
    - One golf photo
    - Status
    - Bio
    - Days/Times available
    - Average score
    - Play style - relaxed, competitive, social, etc
    - Age
    - Male/Female/Other
    - Other choices like music player, smoking, betting, fast
- **Search other golf profiles**
    - Search by geolocation
        - With or without the other profile filters
    - Search by first and last name
        - With or without the geolocation or other profile filters
- **One to one Messaging**
    - Message other people by clicking on message button their profile
- **Send email alerts**
    - Send email notifications when someone messages them
    - limited to one email a day

#### Non-functional Requirements ###
- **Scalable**
- **Performant**
- **Cheap to run**
- **Easy to maintain**

## Implementation ##

#### Microservice Architecture
![Image](/images/ForeFinder-System-Architecture-v1.png)

#### Browser
- Where the user interacts with our application
- Each page is server rendered from a SvelteKit container
- It will establish a websocket connection to the WebSocket server in order to send and to receive one-to-one messaging
- All api calls to the Profile and Message CRUD service will be routed through a SvelteKit container

#### SvelteKit
- The web javascript server rendering framework for the application
- All api calls from browser go through this service except for the websocket connections

#### Ory Kratos
- Handles all of the authentication flows
- Create account, login, getSession, verify, recovery, logout, etc…
- Calls the AWS SES to send emails for verification and recovery
- Stores session and user data in an AWS RDS postgres database

#### Profile and Message CRUD Service
- API allows users to create, update, read, and delete their own profile
- Allows users to search and filter for other profiles
- This service calls the dynamoDB table to get the data
- Allows users to read previous messages

#### WebSocket Server
- Browser establishes a websocket connection to this server
- Allows users to send and receive messages from other people 
- Publish messages sent from the websocket to the specific person’s user id
- Subscribe to messages for a specific person and send them through their websocket connection
- Uses AWS elasticache for redis for the pub/sub

#### DynamoDB
- Uses a single table design to store the profiles and messages


