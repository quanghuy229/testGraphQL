# Test Nelisoftwares

Hello, thank you for applying to Nelisoftwares software engineer position. This quick test will check your knowledge in both front-end (ReactJS) and back-end (ExpressJS/ApolloServer/SQL). We will make a todos app to create, edit, delete and list todos in our React app with Apollo GraphQL + MySQL as back-end. Please read this entire README.md and let us know if you have any question.

# Pre-setup

You need to install Docker on your computer in order to run the database MySQL

- Window (https://docs.docker.com/desktop/windows/install/)
- OSX (https://docs.docker.com/desktop/mac/install/)

Then in a terminal, run the following command to create and run the database.

```
docker run --name test-neli -p 52000:3306 -e MYSQL_DATABASE=neli -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```
# Run the back-end

Make sure you have NodeJS installed.

```
cd back-end && npm i && node index.js
```

# Run the front-end

Make sure you have NodeJS installed.

```
cd front-end && npm i && npm start
```

# Back-end work

- Create a resolver to fetch one Todo (input: id, output: Todo)
- Create a resolver to edit one Todo (input: id, description, isFinished, output: Todo)
- Create a resolver to delete one Todo (input: id, output: String for success or failure)
- Create a resolver to create one Todo (input: id, description, output: Todo)

# Front-end work

- Display the list of current todos
- Be able to delete a todo from database
- Be able to edit a todo from database
- Be able to create a new todo from a description

# Bonus (Optional)

- Setup JS documentation
- Setup unit test with Jest
- Setup e2e test with Cypress
- Nice UX
- Beautiful Design

# Deadline

There are no deadlines, feel free to send back the project once you feel it's finished.
Thank you for your time and hope to welcome soon at Nelisoftwares.
