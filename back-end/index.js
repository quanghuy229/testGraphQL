const { ApolloServer, gql } = require("apollo-server");
const { getDB } = require("./mysql");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Todo {
    id: Int
    description: String
    isFinished: Boolean
    error: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    todos: [Todo],
    getById(id: Int): Todo
  }
  type Mutation {
    create(id: Int, description: String): Todo,
    edit(id: Int, description: String, isFinished: Boolean): Todo,
    delete(id: Int): Boolean
  }
  
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const parseResult = (item, error = null) => {
  const result = Object.values(JSON.parse(JSON.stringify(item)))[0]
  return { ...result, error };
}

const resolvers = {
  Query: {
    todos: async () => {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM todo", (err, todos) => {
          if (err) {
            reject(err);
          } else {
            resolve(todos);
          }
        });
      });
    },
    getById: async (parent, { id }, context, info) => {
      const db = await getDB();
      let error = null;
      const result = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM todo WHERE id=${id} LIMIT 1`, (err, item) => {
          if (err) {
            reject(err);
          }
          if (!item.length) {
            error = `Todo with Id = ${id} not found!`;
          }
          resolve(item);
        });
      });
      return parseResult(result, error);
    }
  },
  Mutation: {
    edit: async (parent, { id, description, isFinished }, context, info) => {
      const db = await getDB();
      let error = null;
      let result = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM todo WHERE id=${id} LIMIT 1`, (err, item) => {
          if (err) {
            reject(err);
          }
          if (!item.length) {
            error = `Todo with Id = ${id} not found!`;
          }
          resolve(item);
        });
      });
      let updated = false;
      if (result.length) {
        await new Promise((resolve, reject) => {
          db.query(`UPDATE todo SET description='${description}', isFinished=${isFinished} WHERE id=${id}`, (err, item) => {
            if (err) {
              reject(err);
            }
            updated = true;
            resolve(item);
          });
        });
      }
      if (updated) {
        result = await new Promise((resolve, reject) => {
          db.query(`SELECT * FROM todo WHERE id=${id} LIMIT 1`, (err, item) => {
            if (err) {
              reject(err);
            }
            if (!item.length) {
              console.log(`Todo with Id = ${id} not found!`)
            }
            resolve(item);
          });
        });
      }
      return parseResult(result, error);
    },
    create: async (parent, { id, description }, context, info) => {
      const db = await getDB();
      let error = null;
      const isExisted = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM todo WHERE id=${id} LIMIT 1`, (err, item) => {
          if (err) {
            reject(err);
          }
          if (item && item.length) {
            error = `Todo with Id = ${id} existed!`;
          }
          resolve(item);
        });
      });
      if (!isExisted.length) {
        await new Promise((resolve, reject) => {
          db.query(`INSERT INTO todo (id, description) VALUES ("${id}","${description}")`, (err, item) => {
            if (err) {
              reject(err);
            }
            resolve(item);
          });
        });
      }
      const result = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM todo WHERE id=${id} LIMIT 1`, (err, item) => {
          if (err) {
            reject(err);
          }
          resolve(item);
        });
      });
      // console.log(result);
      return parseResult(result, error);
    },
    delete: async (parent, { id }, context, info) => {
      const db = await getDB();
      let result = false;
      if (id) {
        const isExisted = await new Promise((resolve, reject) => {
          db.query(`SELECT * FROM todo WHERE id=${id} LIMIT 1`, (err, item) => {
            if (err) {
              reject(err);
            }
            resolve(item);
          });
        });
        if (isExisted.length) {
          await new Promise((resolve, reject) => {
            db.query(`DELETE FROM todo WHERE id=${id} `, (err, item) => {
              if (err) {
                reject(err);
              }
              result = true;
              resolve(item);
            });
          });
        }
      }
      return result
    },
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });


// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
