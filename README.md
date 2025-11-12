

## ChatApp Backend

This backend for the ChatApp is built with Node.js, Express, Socket.io, and Mongoose. It offers real-time communication features including:

- **Status Upload:** Users can upload and update their status.
- **Real-Time Messaging:** Instant messaging with WebSocket support.
- **Live Audio Recording & Messaging:** Record audio live and send as messages.
- **Media Sharing:** Send photos, videos, and audio files (up to 10MB).
- **Efficient Media Handling:** Supports seamless media uploads and transfers for an engaging chat experience.


## Tech Stack


**Server:** Node, Express, Mongodb, Jwt, Passport Authentication,Socket.io,Typescript


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL`
`PORT`
`SECRET_KEY`


## Run Locally

Clone the project

```bash
  git clone https://github.com/11804800/chatapp-backend.git
```

Go to the project directory

```bash
  cd chatapp-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## API Documentation

### Authentication & User Management

#### Register a New User
- **Endpoint:** `POST /api/users/register`
- **Description:** Registers a new user with username, firstname, lastname, and password.
- **Request Body:**
  ```json
  {
    "username": "string",
    "firstname": "string",
    "lastname": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json 
  200 OK with JSON containing success status and token.
  500 Internal Server Error on failure.
  ```

#### Login User
- **Endpoint:** `POST /api/users/login`
- **Description:** Registers a new user with username, firstname, lastname, and password.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

- **Response:**
  ```json 
   200 OK with success status and token.
   401 Unauthorized if credentials are invalid.
   500 Internal Server Error on failure.
  ```

### Get Current User Info
- **Endpoint:** `GET /api/users/`
- **Description:** `Retrieves authenticated user's profile info, including contacts.`
- **Headers:** `Authorization token`
- **Response:** `User data with contact list.`

### Get All Users (excluding current)
- **Endpoint:** `GET /api/users/all`
- **Description:** `Retrieves list of all users except the requesting user.`
- **Headers:** `Authorization token`
- **Response:** `Array of user profiles.`

### Get User Info by ID
- **Endpoint:** `GET /api/users/info/:id`
- **Description:** `Fetches profile info of a user by their ID.`
- **Params:** `id - User ID`
- **Response:** `User details (firstname, lastname, socket_id, image, _id).`

### User Profile & Contact Management
#### Update User Profile
- **Endpoint:** `PUT /api/users`
- **Description:** `Update profile info, including optional profile image.`
- **Headers:** `Authorization token`
- **Request:** `Multipart form-data with optional profile-image.`
- **Body:** `description, firstname, lastname`
- **Response:** `Updated user data.`

### Add a Contact
#### This Route is to add user to contact array of user for messaging and status view.
- **Endpoint:** `POST /api/users/contact`
- **Description:** `Add a contact by user ID.`
- **Headers:** `Authorization token`
- **Request Body:**
   ```json
   {
    "contact": "userId"
  }
  ```
- **Response:** `Updated user data with new contact.`

### Delete a Contact
- **Endpoint:** `DELETE /api/users/contact/:contact`
- **Description:** `Remove a contact by user ID.`
- **Headers:** `Authorization token`
- **Params:** `contact - User ID of contact to delete`
- **Response:** `Updated user data.`

### Delete Multiple Contacts
- **Endpoint:** `PUT /api/users/contact`
- **Description:** `Remove multiple contacts.`
- **Headers:** `Authorization token`
- **Request Body:**
  ```json
    {
      "contacts": ["userId1", "userId2"]
    }
  ```
- **Response:** `Updated contact list.`

### Password Management

#### Reset Password
- **Endpoint:** `POST /api/users/reset-password`
- **Description:** `Reset password via username.`
- **Request Body:**
  ```json 
    {
    "username": "string",
    "password": "string"
    }
  ```
- **Response:** `Success message or error.`

#### Change Password
- **Endpoint:** POST /api/users/change-password
- **Description:** `Change password given old and new password.
- **Request Body:**
  ```json
   {
    "username": "string",
    "oldpassword": "string",
    "newpassword": "string"
   }
  ```
- **Response:** `Success message or error.`
---

### Base URL  `/api/messages`

---

### Model

```json 
    {
    "message": "String",
    "media": "String (filename or URL)",
    "mediaType": "String (e.g., \"audio\", \"image\")",
    "mediaDuration": "String",
    "publisher": "ObjectId (ref: \"user\")",
    "consumer": "ObjectId (ref: \"user\")",
    "seen": "Boolean",
    "recived": "Boolean",
    "recivedTime": "String",
    "sent": "Boolean",
    "sentTime": "String",
    "hiddenId": "Array (user IDs who hid the message)",
    "forward": "Boolean",
    "reply": "ObjectId (ref: \"messages\")",
    "reaction": "String"
    }

```

---

## Authentication

All routes require user authentication via the `verifyUser` middleware. Ensure you include valid authentication tokens in your requests.

---

## Endpoints

### 1. Get Messages
**GET** `/`

Retrieve messages exchanged with the authenticated user.

**Request Headers:**
- Authorization: Bearer `<token>`

**Response:**
```json
{
  "data": [
    {
    "message": "Hey! Check out this cool photo.",
    "media": "https://example.com/image.jpg",
    "mediaType": "image",
    "mediaDuration": "",
    "publisher": "60d0fe4f5311236168a109ca",
    "consumer": "60d0fe4f5311236168a109cb",
    "seen": false,
    "recived": false,
    "recivedTime": "",
    "sent": true,
    "sentTime": "2024-04-27T15:30:00Z",
    "hiddenId": [],
    "forward": false,
    "reply": null,
    "reaction": ""
    },...
  ],
  ```

### 2. Hide Messages

**PUT** `/hide`

#### Hide specified messages for the current user.

### Request Body
```json
    {
        "idArray": ["messageId1", "messageId2", "..."]
        "user": {/* user info */}
    }
```

- **Response**
   ```json
    {
    "reciever": "<user_id>"
    }
   ```
### 3. Clear Chat
- **PUT** `/clear-chat`

#### Clear the chat history with a specific contact.

- **Request Body:**
    ```json
    {
     "contact": "<contact_user_id>"
    }
    ```
- **Response:**
    ```json
    {
     "reciever": "<user_id>"
    }
    ```

### 4. Update Multiple Messages (mark as received)
- **PUT** `/`

#### Update multiple messages to mark as received.

- **Request Body:**

    ```json
        {
        "idArray": ["messageId1", "messageId2", "..."]
        }
    ```
- **Response:**
    ```json
    {
    "reciever": "<user_id>"
    }
    ```

### 5. Update Message Seen
- **PUT** `/publisher/seen`

#### Mark specified messages as seen.

- **Request Body:**
  ```json 
    {
     "idArray": ["messageId1", "messageId2", "..."]
    }
  ```

- **Response:**
  ```json
    {
     "reciever": "<user_id>"
    }
  ```

### 6. Send Audio Message
- **POST** `/media`

#### Upload and send an audio message.

- **Form Data:**
    ```json 
        file: audio file (mp3)
        consumer: recipient user ID
        mediaDuration: duration of the audio in seconds
    ```
- **Response:**

    ```json 
        {
        "data": { /* message object */ }
        }
    ```

### 7. Send Media Message (e.g., image or other files)
**POST** `/`

#### Upload and send a media message.

- **Form Data:**
    ```json
        file: media file
        message: optional message text
        mediaType: type of media (e.g., "image", "video")
        consumer: recipient user ID
        mediaDuration: optional duration (for media like videos)
    ```
- **Response:**

    ```json 
        {
        "data": { /* message object */ }
        }
    ```

### 8. Update a Message
-**PUT** `/:id`

#### Update a specific message by ID.

- **Request Body:**

`Fields to update (e.g., message text, reaction)`
- **Response:**

  ```json
    {
     "data": { /* updated message object */ }
    }
  ```

 ### 9. Delete a Message
**DELETE** `/:id`

#### Delete a message by ID.

- **Response:**
    ```json
    {
     "data": { /* deleted message object */ }
    }
    ```
### Media Uploads
 - Audio files are saved with a filename pattern: <timestamp>-<originalname>.mp3
- Other media files are saved with their original name and extension.

---
## Base URL
`/api/status`

---

# Status Schema

This project includes a Mongoose schema for managing user statuses, similar to features found in social media applications.

## Overview

The `StatusSchema` defines the structure of a status update, including references to the user, media content, expiration, and views.

## Schema Details

```js
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    type: String
  },
  file: {
    type: String
  },
  mediaType: {
    type: String
  },
  link: {
    type: String
  },
  expires: { 
    type: Date, 
    expires: '2m' // Status will automatically delete after 2 minutes
  },
  seen: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user" 
  }]
}
```

---

## Authentication

All routes require user authentication via the `verifyUser` middleware. Include your valid auth token in the request headers.

---

## Endpoints

### 1. Get User Statuses and Contacts' Statuses
**GET** `/`

Retrieve the current user's statuses and contact statuses with seen info.

**Request Headers:**
- Authorization: Bearer `<token>`

**Response:**
```json
{
  "data": {
    {
    "user": "60d0fe4f5311236168a109ca",  // Example ObjectId of a user
    "text": "Enjoying the sunny day!",
    "file": "https://images.example.com/sunny-day.jpg",
    "mediaType": "image",
    "link": "https://weather.com/sunny",
    "expires": "2023-12-31T23:59:59.000Z",
    "seen": [
        "60d0fe4f5311236168a109cb", // User who viewed
        "60d0fe4f5311236168a109cc"
    ]
    },...
  }
}
```

- **Note:** `This fetches the user, their contacts, and associated statuses with seen information.`

### 2. Post a New Status
- **POST** `/`

#### Create a new status update with optional media.

- **Form Data:**

    ```json
    media: media file upload (image, video, etc.)
    text: optional text message
    link: optional link
    ```

- **Response:**

    ```json
    {
    "data": { /* newly created status object */ }
    } 
    ```

- **Notes:**

    ```
    Media files are stored in public/status/.
    The status will automatically expire after 24 hours.
    ```

### 3. Delete a Status
- **DELETE** `/:id`

#### Remove a status by its ID.

- **Request Params:**

    `id: status ID`
- **Response:**
```json
{
  "data": { /* deleted status object */ }
}
```
### 4. Update Status (Mark as Seen)
- **PUT** `/:id`

#### Mark a status as seen by the current user.

- **Request Params:**

        `id: status ID`
- **Response:**

    ```json
    {
    "data": { /* updated status object */ }
    }
    ```

- **Media Uploads**
```
Media files are stored in the public/status/ directory.
Files are named with the original filename appended with a timestamp and extension, e.g., filename-1630612345678.jpg.
```

## Socket Usage

- Clients connect via Socket.IO and emit events such as:
- connection
- start-typing
- end-typing
- send-message
- media-message
- send-file-message
- reaction
- message-seen
- message-recived

#### The server handles these events, updates the database, and emits real-time updates to relevant users.

### Socket Event List

| Event Name             | Direction             | Description                                              |
|------------------------|-----------------------|----------------------------------------------------------|
| connection             | Client to server      | Register user connection and notify others             |
| start-typing          | Client to server      | Notify recipient that user is typing                   |
| end-typing            | Client to server      | Notify recipient that user stopped typing             |
| send-message          | Client to server      | Send a message, update contacts, notify recipient     |
| media-message         | Client to server      | Send media (audio, images, videos)                      |
| send-file-message     | Client to server      | Send file messages, update last message info          |
| reaction              | Client to server      | Add reaction to a message                               |
| message-seen          | Client to server      | Acknowledge message has been seen                      |
| message-received      | Client to server      | Notify others a message has been received             |
| disconnect            | Client to server      | Handle user disconnect, update status                 |

