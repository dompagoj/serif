import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export interface IFileHandlerEvent {
  uris: string[];
}

export function setReceiveFileHandler(handler: (event: IFileHandlerEvent) => any) {
  if (Platform.OS === 'ios') {
    return;
  }
  const eventEmitter = new NativeEventEmitter(NativeModules.RNHandleShareFileIntentModule);
  eventEmitter.addListener('ShareFileIntent', (args) => {
    handler(args);
  });
}
