import { useRoute } from '@react-navigation/native';
import React from 'react';

import { UploadingView } from '../components/UploadingView';

export const UploadingScreen = () => {
  const { params = {} } = useRoute<any>();
  const { uploadToken, contentUri } = params;

  if (!uploadToken) {
    throw new Error('Missing upload token :(');
  }

  if (!contentUri) {
    throw new Error('Missing content uri :(');
  }

  const remoteUrl = `https://shaerif.herokuapp.com/file/${uploadToken}`;
  return <UploadingView remoteUrl={remoteUrl} contentUri={contentUri} />;
};
