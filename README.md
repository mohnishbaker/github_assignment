# github_assignment
An app that will help recruiters review candidates github information by listing the github repositories and maintain user information in database.

# Prerequisite

Local mongodb instance
Node JS

# Working

The app takes username and reponame as request and contains 2 controllers -

## User-

EndPoint - 

user/userSearch

This displays the user's details according to the github's username.

## Repository - 

EndPoint - 
repo/repoSearch

This API fetches the repositories with the supplied repository names. 
After the successful fetch of result repo name, owner name, description, stars count, and hyperlink to the repo URL are sent in the response output.

Installation
`npm install`

Running the app
# development
`$ npm run start`

# watch mode
`$ npm run start:dev`

nodemon can also be used to run the app.

Postman 
APIs can be accessed using this URL
http://localhost:3000/
