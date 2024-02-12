import { registerWebPush, unregisterWebPush, updateWebPush } from '@/utils/api';
import { getTCaptchaAsync } from '@/utils/functions';
import { useModel } from '@umijs/max';
import { useBoolean, useLocalStorageState } from 'ahooks';
import { App, Button, Checkbox, Popconfirm, Radio, theme } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

type Triggers = '0' | '9' | '-1D0' | '-1D9';

export type PushSettingsType = {
  platform: 'firebase' | 'huawei';
  triggers: Triggers[];
  token: string;
  secret: string;
  updatedAt: number;
};

const TriggersMap = {
  '0': 0b0001,
  '9': 0b0010,
  '-1D0': 0b0100,
  '-1D9': 0b1000,
};

const { useToken } = theme;

const Component: React.FC = () => {
  const { token } = useToken();
  const { message } = App.useApp();
  const { tryGetMessaging, tryGetMessagingToken, tryDeleteMessagingToken } =
    useModel('firebaseModel');
  const [settings, setSettings] = useLocalStorageState<PushSettingsType | null>(
    'pushSettings',
    {
      defaultValue: null,
    },
  );

  const [currentPlatform, setCurrentPlatform] = useState('firebase');
  const [settingsCache, setSettingsCache] = useState<PushSettingsType | null>(
    null,
  );
  const [registerLoading, registerLoadingActions] = useBoolean(false);
  const [saveLoading, saveLoadingActions] = useBoolean(false);
  const [unregisterLoading, unregisterLoadingActions] = useBoolean(false);

  useEffect(() => {
    setSettingsCache(settings ?? null);
  }, [settings]);

  const register = useCallback(async () => {
    let tcaptcha = await getTCaptchaAsync();

    if (tcaptcha.ret !== 0) {
      message.error('人机验证失败');
      return;
    }

    if (currentPlatform === 'firebase') {
      try {
        await tryGetMessaging();
        let token = await tryGetMessagingToken();

        let resp = await registerWebPush(
          currentPlatform,
          token,
          JSON.stringify({
            ticket: tcaptcha.ticket,
            randstr: tcaptcha.randstr,
          }),
        );

        if (resp.code === 200) {
          message.success('注册成功');

          setSettings({
            platform: 'firebase',
            triggers: ['0'],
            secret: resp.data ?? '',
            token: token,
            updatedAt: new Date().getTime(),
          });
        } else {
          message.error(`注册失败: ${resp.data}`);
        }
      } catch (e) {
        message.error(e as string);
      }
    } else if (currentPlatform === 'huawei') {
      //
    }
  }, [currentPlatform]);

  const update = useCallback(async () => {
    let tcaptcha = await getTCaptchaAsync();

    if (tcaptcha.ret !== 0) {
      message.error('人机验证失败');
      return;
    }

    let triggers = 0;
    settingsCache?.triggers?.forEach((trigger) => {
      triggers |= TriggersMap[trigger];
    });
    let resp = await updateWebPush(
      settings?.platform ?? 'firebase',
      settings?.token ?? '',
      JSON.stringify({ ticket: tcaptcha.ticket, randstr: tcaptcha.randstr }),
      settings?.secret ?? '',
      triggers,
    );
    if (resp.code === 200) {
      message.success('保存成功');
    } else {
      message.error(`保存失败: ${resp.data}`);
    }

    setSettings(settingsCache);
  }, [settings, settingsCache]);

  const del = useCallback(async () => {
    let tcaptcha = await getTCaptchaAsync();

    if (tcaptcha.ret !== 0) {
      message.error('人机验证失败');
      return;
    }

    try {
      await tryGetMessaging();

      if (!(await tryDeleteMessagingToken())) {
        message.error('注销失败');
        return;
      }
    } catch (e) {
      message.error('注销失败 ' + e);
      return;
    }

    let resp = await unregisterWebPush(
      settings?.platform ?? 'firebase',
      settings?.token ?? '',
      JSON.stringify({ ticket: tcaptcha.ticket, randstr: tcaptcha.randstr }),
      settings?.secret ?? '',
    );

    if (resp.code === 200) {
      message.success('注销成功');
      setSettings(null);
    } else {
      message.error(`注销失败: ${resp.data}`);
    }
  }, [settings]);

  return (
    <div>
      {!settings && (
        <div>
          <div className="pb-2 font-semibold">平台</div>
          <div className="pb-3">
            <Radio.Group
              value={currentPlatform}
              onChange={(e) => setCurrentPlatform(e.target.value)}
            >
              <Radio value="firebase">Firebase</Radio>
              <Radio value="huawei" disabled>
                华为
              </Radio>
            </Radio.Group>
          </div>
          <div>
            <Button
              type="primary"
              loading={registerLoading}
              onClick={() => {
                registerLoadingActions.setTrue();
                register().then(() => {
                  registerLoadingActions.setFalse();
                });
              }}
            >
              注册
            </Button>
          </div>
        </div>
      )}
      {settings && (
        <div>
          <div className="pb-2 font-semibold">平台</div>
          <div className="pb-3 flex">
            <div className="flex-grow">
              {{ firebase: 'Firebase', huawei: '华为' }[settings.platform]}
            </div>
            <div
              style={{
                color: token.colorTextSecondary,
              }}
            >
              已注册
            </div>
          </div>
          <div className="pb-2 font-semibold">推送时间</div>
          <div className="pb-2">
            <Checkbox.Group
              value={settingsCache?.triggers ?? []}
              onChange={(values) => {
                setSettingsCache((s) => ({
                  platform: s?.platform ?? 'firebase',
                  triggers: values as Triggers[],
                  secret: s?.secret ?? '',
                  token: s?.token ?? '',
                  updatedAt: new Date().getTime(),
                }));
              }}
            >
              <div className="grid grid-cols-1">
                <Checkbox value="0">游戏发售日0时</Checkbox>
                <Checkbox value="9">游戏发售日9时</Checkbox>
                <Checkbox value="-1D0">游戏发售日前一天0时</Checkbox>
                <Checkbox value="-1D9">游戏发售日前一天9时</Checkbox>
              </div>
            </Checkbox.Group>
          </div>
          <div className="flex gap-x-2">
            <Button
              loading={saveLoading}
              onClick={() => {
                saveLoadingActions.setTrue();
                update().then(() => saveLoadingActions.setFalse());
              }}
            >
              保存
            </Button>
            <Popconfirm
              title="确定要注销吗？"
              onConfirm={() => {
                unregisterLoadingActions.setTrue();
                del().then(() => {
                  unregisterLoadingActions.setFalse();
                });
              }}
              okButtonProps={{
                danger: true,
              }}
            >
              <Button danger loading={unregisterLoading}>
                注销
              </Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </div>
  );
};

export default Component;
