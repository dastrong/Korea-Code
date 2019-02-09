# [Korea Code](https://koreacode.herokuapp.com/)

### What is it?
A site created for people in South Korea who are interested in programming.   

### Why did I make this?
I wanted to connect with other developers in South Korea and use some of the tools and knowledge gained from my YelpCamp project.  

### What were some cool features? 
- included a customized rich text editor
- responsive masonry grid layout for posts 
- editable profile page
- connected a Facebook Page
    - users can view upcoming events, posts, or directing message the admin team
- added a Gitter chat sidecar
    - users can join the group chat
    - can use on mobile if downloaded from the app store

### What tech did I use?
##### Links/Scripts
- QuillJS
- Masonry
- Bootstrap
- jQuery
##### Installed
- Check out the `package.json` for a complete list

### Want to try locally?
- `git clone` the project
- `cd` into project folder
- `npm i` dependencies
- create a `.env` file with the following:
```
DB_LOCAL=mongoLocalUrlHere
DB_URL=mongoProdUrlHere
FB_CLIENT_ID=facebookClientIdHere
FB_CLIENT_SECRET=facebookClientSecretHere
```
- `nodemon` or `npm start` to start server
- Open your browser