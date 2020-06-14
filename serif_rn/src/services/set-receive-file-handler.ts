import { NativeEventEmitter, NativeModules } from 'react-native';

export interface IFileHandlerEvent {
  uris: string[];
}

export function setReceiveFileHandler(handler: (event: IFileHandlerEvent) => any) {
  const eventEmitter = new NativeEventEmitter(NativeModules.RNHandleShareFileIntentModule);
  eventEmitter.addListener('ShareFileIntent', (args) => {
    handler(args);
  });
}
