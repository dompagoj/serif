import express from 'express';
import cors from 'cors';
import promisepipe from 'promisepipe';
import QRCode from 'qrcode';
import crypto from 'crypto'
import morgan from 'morgan';

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
app.use(morgan('tiny'));

app.get('/', async (req, res: express.Response) => {
  const token = crypto.randomBytes(20).toString('hex');
  const src = await QRCode.toDataURL(token);
  const href = `/file/${token}`;
  const template = `
    <html>
      <div>
        <img src="${src}" height="80%" />
      </div>
      <a href="${href}">Start downloading</a>
    </html>
   `;
  res.send(template);
});

async function handleRequestFromGet(browserRes: express.Response, token: string) {
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

  await handleRequest(pendingRequest.appReq, pendingRequest.appRes, browserRes);
}

async function handleRequestFromPost(appRequest: express.Request, appRes: express.Response) {
  const { token } = appRequest.params;
  const pendingRequest = pendingRequests[token]

  if (!pendingRequest) {
    throw new Error('Missing pending request');
  }
  if (!pendingRequest.browserRes) {
    throw new Error('Missing request from browser ' + token);
  }

  await handleRequest(appRequest, appRes, pendingRequest.browserRes);
}

function closeEverything(appRes: express.Response, browserRes: express.Response) {
  try { appRes.json({}) } catch (e) {}
  try { browserRes.json({}) } catch (e) {}
}

async function handleRequest(appReq: express.Request, appRes: express.Response, browserRes: express.Response) {
  const { token } = appReq.params;

  try {
    console.log('piping request', token);
    await promisepipe(appReq, browserRes);
    console.log('pipe done!');
    appRes.json({ok: true});
  } catch (e) {
    console.error(e);
  } finally {
    delete pendingRequests[token];
    closeEverything(appRes, browserRes);
  }
}

app.get('/file/:token', async (browserReq: express.Request, browserRes: express.Response) => {
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

app.post('/file/:token/:path*?', (appReq: express.Request, appRes: express.Response) => {
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

app.get('/status/:token', (appReq: express.Request, appRes: express.Response) => {
  const { token } = appReq.params;
  if (!token) {
    return appRes.status(401).json({ error: 'Missing token' });
  }
  const pendingRequest = pendingRequests[token];
  if (!pendingRequest || !pendingRequest.appReq) {
    return appRes.json({ status: 'WAITING' });
  }

  appRes.json({ status: 'UPLOADING' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
