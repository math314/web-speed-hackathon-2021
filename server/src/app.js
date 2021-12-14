import bodyParser from 'body-parser';
import Express from 'express';
import compression from 'compression';
import session from 'express-session';

import { apiRouter } from './routes/api';
import { staticRouter } from './routes/static';

const app = Express();

app.use(compression({
  threshold: 0,
  level: 9,
  memLevel: 9,
  filter: shouldCompress,
}));

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  if (req.path.startsWith("/api/")) {
    return false;
  }
  if (req.path.startsWith("/fonts/")) {
    return false;
  }

  // console.log(`${req.path}`);
  // fallback to standard filter function
  return compression.filter(req, res);
}

app.set('trust proxy', true);

app.use(
  session({
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb' }));

// app.use((_req, res, next) => {
//   res.header({
//     'Cache-Control': 'max-age=0, no-transform',
//     Connection: 'close',
//   });
//   return next();
// });

app.use('/api/v1', apiRouter);
app.use(staticRouter);

export { app };
