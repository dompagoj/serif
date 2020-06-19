import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

export interface IFileHandlerEvent {
  uris: string[];
}

export function setReceiveFileHandler(handler: (event: IFileHandlerEvent) => any) {
  if (Platform.OS === 'ios') {
    ReceiveSharingIntent.getReceivedFiles((files) => {
      console.log('files', files);
      const uris = files.map((file) => file.filePath);
      handler({ uris });
    }, console.error);
    return;
  }
  const eventEmitter = new NativeEventEmitter(NativeModules.RNHandleShareFileIntentModule);
  eventEmitter.addListener('ShareFileIntent', (args) => {
    handler(args);
  });
}
