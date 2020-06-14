import axios from 'axios';
import bluebird from 'bluebird';
import { css } from 'emotion';
import random from 'random-string-generator';
import React from 'react';
import { useAsync } from 'react-use';

const containerStyle = css`
  display: flex;
  flex: 1;
  align-content: center;
  justify-content: center;
  align-items: center;
  justify-items: center;
`;

const baseUrl = process.env.REACT_APP_BACKEND_URL || 'https://shaerif.herokuapp.com';

const token = random();

export const LandingPage = () => {
  const qrUrl = `${baseUrl}/qr-code/${token}`;
  const statusUrl = `${baseUrl}/status/${token}`;
  const fileUrl = `${baseUrl}/file/${token}`;

  useAsync(async () => {
    while (true) {
      const { data } = await axios(statusUrl);
      if (data && data.status === 'UPLOADING') {
        window.open(fileUrl, '_parent');
        return;
      }
      await bluebird.delay(1000);
    }
  });

  return (
    <div className={containerStyle}>
      <img src={qrUrl} alt="QR Code" />
    </div>
  );
};
