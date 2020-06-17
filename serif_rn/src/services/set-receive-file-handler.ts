import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

export interface IFileHandlerEvent {
  uris: string[];
}

export function setReceiveFileHandler(handler: (event: IFileHandlerEvent) => any) {
  if (Platform.OS === 'ios') {
    ReceiveSharingIntent.getReceivedFiles(console.log, console.error);
    return;
  }
  const eventEmitter = new NativeEventEmitter(NativeModules.RNHandleShareFileIntentModule);
  eventEmitter.addListener('ShareFileIntent', (args) => {
    handler(args);
  });
}
