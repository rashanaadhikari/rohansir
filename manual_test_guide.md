# Manual Verification Guide

1.  **Configure Environment**:
    Open the `.env` file and fill in your Cloudinary credentials and MongoDB URI.
    ```env
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    MONGODB_URI=mongodb://localhost:27017/image-crud-demo
    ```

2.  **Start Server**:
    ```bash
    npm start
    ```

3.  **Test Upload (POST /upload)**:
    Using curl (replace `/path/to/image.jpg` with a real file path):
    ```bash
    curl -F "image=@/Users/rasnaadhikari/Desktop/test_image.jpg" http://localhost:3000/upload
    ```
    *Or use Postman: POST to http://localhost:3000/upload, Body -> form-data -> Key: "image", Value: [Select File]*

4.  **Test Get All (GET /images)**:
    ```bash
    curl http://localhost:3000/images
    ```
    You should see the JSON array with the uploaded image.

5.  **Test Delete (DELETE /images/:id)**:
    Copy the `_id` from the previous step.
    ```bash
    curl -X DELETE http://localhost:3000/images/<PASTE_ID_HERE>
    ```
