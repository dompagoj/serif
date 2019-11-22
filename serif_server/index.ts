import express from 'express';
import cors from 'cors';
import promisepipe from 'promisepipe';

const app = express();
const port = process.env.PORT || 3000;

interface IPendingRequest {
  browserRes?: express.Response;
  appReq?: express.Request;
  appRes?: express.Response;
}

type PendingRequestsMap  = { [token: string]: IPendingRequest };

const pendingRequests: PendingRequestsMap = {};

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

function handleRequestFromGet(browserRes: express.Response, token: string) {
  const pendingRequest = pendingRequests[token];

  if (!pendingRequest) {
    throw new Error('Missing pending request');
  }
  if (!pendingRequest.appReq) {
    throw new Error('Missing request from app ' + token);
  }

  if (!pendingRequest.appRes) {
    throw new Error('Missing response from from app ' + token);
  }

  handleRequest(pendingRequest.appReq, pendingRequest.appRes, browserRes);
}

function handleRequestFromPost(appRequest: express.Request, appRes: express.Response) {
  const { token } = appRequest.params;
  const pendingRequest = pendingRequests[token]

  if (!pendingRequest) {
    throw new Error('Missing pending request');
  }
  if (!pendingRequest.browserRes) {
    throw new Error('Missing request from browser ' + token);
  }

  handleRequest(appRequest, appRes, pendingRequest.browserRes);
}

async function handleRequest(appReq: express.Request, appRes: express.Response, browserRes: express.Response) {
  const { token } = appReq.params;
  console.log('piping request', token);
  await promisepipe(appReq, browserRes);
  console.log('pipe done!');
  appRes.json({ ok: true });
  delete pendingRequests[token];
}

app.get('/file/:token', (browserReq: express.Request, browserRes: express.Response) => {
  const { token } = browserReq.params;
  if (!token) {
    return browserRes.status(401).json({ error: 'Missing token' });
  }
  const pendingRequest = pendingRequests[token];
  if (pendingRequest) {
    return handleRequestFromGet(browserRes, token);
  }
  console.log('adding browser request to map');
  pendingRequests[token] = { browserRes };
});

app.post('/file/:token', (appReq: express.Request, appRes: express.Response) => {
  const { token } = appReq.params;
  if (!token) {
    return appRes.status(401).json({ error: 'Missing token' });
  }
  const pendingRequest = pendingRequests[token];
  if (pendingRequest) {
    return handleRequestFromPost(appReq, appRes);
  }
  console.log('adding app request to map');
  pendingRequests[token] =  { appReq, appRes };
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
