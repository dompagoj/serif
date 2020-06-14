import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

import { FlexView } from '../components/FlexView';
import { useNavigation } from '../hooks/use-navigation';
import { IFileHandlerEvent, setReceiveFileHandler } from '../services/set-receive-file-handler';

export const FilePickerScreen = () => {
  const { toScanner } = useNavigation();
  const isFocused = useIsFocused();
  const { params = {} } = useRoute<any>();
  const { previousUploadStatus } = params;

  function handleFilePick(event: IFileHandlerEvent) {
    if (!isFocused) {
      return;
    }
    const { uris } = event;
    if (!uris) {
      return;
    }
    const [uri] = uris;
    if (!uri) {
      return;
    }
    toScanner(uri);
  }

  useEffect(() => {
    setReceiveFileHandler(handleFilePick);
  }, []);

  return (
    <FlexView alignItemsCenter justifyContentCenter flex={1} sideMargin={30}>
      {previousUploadStatus && <Text>{previousUploadStatus}</Text>}
      <Text>Sharing a file with ShareIf from another app will open a QR Code Uploader</Text>
    </FlexView>
  );
};
