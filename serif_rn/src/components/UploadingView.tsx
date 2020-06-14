import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import useAsync from 'react-use/lib/useAsync';

import { useNavigation } from '../hooks/use-navigation';
import { FlexView } from './FlexView';

type UploadState = 'EMPTY_URL' | 'STARTING' | 'AWAITING_DOWNLOADER' | 'UPLOADING' | 'DONE' | 'ERROR';

export const UploadingView = ({ remoteUrl, contentUri }) => {
  const [uploadState, setUploadState] = useState<UploadState>('STARTING');
  const { toFilePicker } = useNavigation();

  async function handleUpload() {
    console.log('uploading', contentUri);
    setUploadState('STARTING');
    const localFile = await fetch(contentUri);
    setUploadState('AWAITING_DOWNLOADER');
    const fileBlob = (await localFile.blob()) as any;
    setUploadState('UPLOADING');
    const serverRes = await fetch(remoteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': fileBlob && fileBlob.type,
      },
      body: fileBlob,
    });

    const serverJsonResponse = await serverRes.json();
    setUploadState('DONE');
    console.log('serverJsonResponse', serverJsonResponse);
  }

  useAsync(async () => {
    try {
      await handleUpload();
      toFilePicker('File uploaded');
    } catch (e) {
      toFilePicker(e.message);
    }
  });

  console.log('uploadState', uploadState);

  return (
    <FlexView alignItemsCenter justifyContentCenter flex={1}>
      <ActivityIndicator size="large" />
    </FlexView>
  );
};
