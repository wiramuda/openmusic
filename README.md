# Api Specs

## Authentications
This api using a Bearer Token

### add user to database
Request
- method: POST
- endpoint: /users
- body: 
  ```json
    "username": "string",
    "password": "string",
    "fullname": "string"
  ```
Response
- body: 
   ```json
      "status": "string",
      "data": {
         "user_id": "string"
      }
   ```
### login with valid user
Request
- method: POST
- endpoint: /authentications
- body: 
   ```json
      "username": "string",
      "password": "string"
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "data": {
         "accessToken": "string",
         "refreshToken": "string"
      }
      
   ```
### request for refresh token
Request
- method: PUT
- endpoint: /authentications
- body: 
   ```json
      "refreshToken": "string"
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "data": {
         "accessToken": "string"
      }
      
   ```
### logout 
Request
- method: DELETE
- endpoint: /authentications
- body: 
   ```json
      "refreshToken": "string"
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "message": "string"
      
   ```

## Create Album
Request
- method: POST
- endpoint: /albums
- Header:
   - Authorization: Bearer [ your token ]
- body:
    ```json
        "name": "string",
        "year": "number",
    ```

Response:
```json
    "status": "string",
    "data": {
        "albumId": "string"
    }
```

## Playlist
### add playlist
Request
- method: POST
- endpoint: /playlists  
- body: 
   ```json
      "name": "string",
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "data": {
         "playlistId": "string"
      }
      
   ```
   
   ### get playlist
   Request
- method: GET
- endpoint: /playlists  

Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "data": {
         "playlists": "array"
      }
   ```
   
   ### delete playlist by id
   Request
- method: DELETE
- endpoint: /playlists{id:"string"}  
- body: 
   ```json
      "name": "string",
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "message": "string"
   ```
### add songs to spesific playlist
Request
- method: POST
- endpoint: /playlists/{id:"string"}/songs  
- body: 
   ```json
      "songId": "string",
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "message": "string"
      
   ```
### get songs from spesific playlist
Request
- method: POST
- endpoint: /playlists/{id:"string"}/songs  

Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "data": {
         "playlist": {
            "id": "string",
            "name": "string",
            "username": "string",
            "songs": [
                  {
                     "id": "string",
                     "title": "string",
                     "performer": "string"
                  }
               ]
            }
         }
      
   ```
### delete song from spesific playlist
Request
- method: POST
- endpoint: /playlists/{id:"string"}/songs  
- body: 
   ```json
      "songId": "string",
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "message": "string"
   ```

## playlist collaborator service
### add collaboration
Request
- method: POST
- endpoint: /collaborations  
- body: 
   ```json
      "userId": "string",
      "playlistId": "string"
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "data": {
         "collaborationId": "string"
      }
   ```
### delete collaboration
Request
- method: DELETE
- endpoint: /collaborations  
- body: 
   ```json
      "userId": "string",
      "playlistId": "string"
   ```
Response
- statusCode: "number"
- body: 
   ```json
      "status": "string",
      "mesage": "string"
   ```
