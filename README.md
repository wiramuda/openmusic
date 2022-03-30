# Api Specs

## Authentications
This api using a Bearer Token 


## Create Album
Request
- method: POST
- endpoint: /albums
- Header:
   - Authorization: Bearer [ your token ]
- body:
    ```json
        "name": "string",
        "year": number,
    ```

Response:
```json
    "status": "string",
    "data": {
        "albumId": "string"
    }
```




