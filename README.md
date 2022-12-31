# Attendance-Face-Recog-Backend

## Description

This project is a basic attendance system with the ability for face recognition. When an employee works from home there is no way to check if the employee is always working or not.So this system is proposed so as to track the employee through his camera and track his face.

## Working

The employee must login in as soon as it starts working.So the camera turns on and at random intervals the software takes screenshots.The images are sent to backend where the image is processed i.e the face is extracted from image and then compared to the embeddings of the employee's face.The timestamp is stored in database and if the employees face exist in the image it interval between last captured image and current image is calculated and then added to the working hours.

## Face Recognition Approach

We have used face-api.js as the library under the hood for face recognition and extraction.

Url - https://justadudewhohacks.github.io/face-api.js/docs/index.html

## Running the project

1.  Run npm install to install all the dependencies
2.  Create an env folder and add .env.development or .env.production file. The content is stored in the .env.sample in root.
3. Run npm run build to compile the files.  
4. Run npm run dev to start in development mode or npm start to start in production model
