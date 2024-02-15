export type PlatformsType = {
  android?: string;
  web?: (args: string) => any;
};

type WebViewJavascriptBridgeType = {
  callHandler: (
    name?: string,
    data?: string,
    callback?: (response: any) => void,
  ) => void;
};

export function getPlatform() {
  // @ts-ignore
  if (window?.['AndroidJsSdk']) {
    return 'android';
  } else {
    return 'web';
  }
}

export function platformExec(platforms: PlatformsType) {
  let p = getPlatform();
  switch (p) {
    case 'android': {
      // @ts-ignore
      let bridge = window['AndroidJsSdk'] as WebViewJavascriptBridgeType;

      return (args: string) =>
        new Promise((resolve) => {
          console.log(args);
          bridge.callHandler(platforms.android, args, (response) => {
            resolve(response);
          });
        });
    }
    case 'web': {
      return (args: string) =>
        new Promise((resolve) => {
          resolve(platforms.web?.(args));
        });
    }
  }
}
