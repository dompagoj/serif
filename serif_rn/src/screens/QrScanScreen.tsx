import { useRoute } from '@react-navigation/native';
import React from 'react';

import { CodeScanner } from '../components/CodeScanner';
import { useNavigation } from '../hooks/use-navigation';

export const QrScanScreen = () => {
  const { params = {} } = useRoute<any>();
  const { contentUri } = params;

  const { toUploader } = useNavigation();

  function handleScan(uploadToken: string) {
    toUploader(uploadToken, contentUri);
  }

  return <CodeScanner onScan={handleScan} />;
};
