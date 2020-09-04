## Interest Designs

### To help people access resources and be served according to their unique interests

### App Use: 
- Home page is an open scroll to look through pics.
- If logged in, user has option to add to a bin
- User can take bin with them to chat with host about those pics
- User can update query manually whenever by entering into search bar
- Search will automatically narrow down items by interest level so manual intervention is necessary if a more diverse response is desired

### User Stories: 
- AAU I want to be able to seamlessly scroll and not be aware of or interrupted by anything happening in the background
- AAU I want to get accurate but also interesting suggestions based on my interests
- AAU I want to be see when I'm waiting for the host or if they left
- AAU I want to be able to see my bin and easily add and remove items
- AAU I want to see my messages to the host including some past ones for context
- Also I want to see clearly what are my messages and what are the hosts'

### MVP
- Allows user to interact with photos and gives suggestions/rendering based on preferences
- Records and submits preferences to host
- Allows user to interact with host and the information to be used here
- Has ip identification and conversion to oauth to keep track of users

### Icebox Features
- Improved design of chat pages
- socket on chat pages to send to specific socket
- Better search optimization: regex to sift tags used in query for unhelpful terms
- Better bin design
- Authorization

### Pseudocode:
```
User model stores user  identifying info and sets of pics for rotation and interest and tags most interested in. User document is created on site navigation and continually updated based on activity. Tags are cyclically reeavaluated and new ones generated based on user activity.

Updates are submitted via sockets and new pics are generated by query from pic api. 

Login opens visibility of bin. Bin is updated and items added /removed by socket.

User info is savved and transmitted to host in the event user goes to chat
```
### App Screenshots

### Wireframes
![wireframes](./images/IMG_2538.jpg)

### Deployment Link
[intdesigns](https://intdesigns.herokuapp.com)

### Technologies Used
- NodeJS
- Expressjs
- Express Generator
- MongoDB
- MongooseJS
- MongoDB Atlas
- EJS Templating
- Heroku with NodeJS
- Fetch in JS
- Google OAuth 2.0
- PassportJS
- Lodash
- Pixabay API
- Socket io






