import session from "express-session";
import MongoStore from "connect-mongo";

const isProduction = process.env.NODE_ENV === "production";

const sessionMiddleware = session({
  name: "queuelens.sid",

  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24,
  }),

  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
