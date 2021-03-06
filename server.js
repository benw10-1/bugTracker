const express = require('express');
const handlebars = require('express-handlebars');
const PORT = process.env.PORT || 3001;
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const hdbx = handlebars.create({ helpers });
const mainRoute = require('./routes/routes');

app.engine('handlebars', hdbx.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(
  session({
    secret: 'testtest123',
    cookie: {
      maxAge: 3600000,
      sameSite: 'strict',
    },
    resave: true,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', mainRoute);
app.use(express.static('statics'));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
});
