import Reactotron, { openInEditor } from 'reactotron-react-native';
import { NativeModules } from 'react-native';

if (__DEV__) {
  let scriptHostname;
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];

  Reactotron
    .configure({
      host: scriptHostname,
      socketIoProperties: {
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      }
    })
    .use(openInEditor())
    .connect()
}