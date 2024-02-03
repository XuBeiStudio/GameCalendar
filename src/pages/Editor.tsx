import Game from '@/components/Game';
import GameList from '@/components/GameList';
import { GameType } from '@/utils/types';
import { request, useQuery } from '@@/exports';
import {
  ProForm,
  ProFormCheckbox,
  ProFormColorPicker,
  ProFormDatePicker,
  ProFormFieldSet,
  ProFormText,
} from '@ant-design/pro-components';
import { useThrottleFn } from 'ahooks';
import {
  App,
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Skeleton,
  Space,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';

const Page: React.FC = () => {
  const [form] = ProForm.useForm();
  const { message } = App.useApp();

  const { data: baseData, isLoading } = useQuery(
    ['gameDatas'],
    async () => request<GameType[]>('/data.json'),
    {
      refetchOnWindowFocus: false,
    },
  );

  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const [games, setGames] = useState<GameType[]>([]);

  useEffect(() => {
    if (baseData) {
      setGames(baseData);
    }
  }, [baseData]);

  const createGame = () => {
    const id = uuidv4();
    setGames((games) => [...games, { id }]);
    setCurrentGameId(id);
    form.resetFields();
  };

  const deleteGame = (id: string) => {
    setGames((games) => games.filter((g) => g.id !== id));
    setCurrentGameId(null);
  };

  const updateGame = useThrottleFn((id: string, data: any) => {
    data.title = data.title ?? '';
    data.subtitle = data.subtitle ?? [];
    data.releaseDate =
      data.releaseDate?.format?.('YYYY.MM.DD') ??
      data.releaseDate ??
      '1970.01.01';
    data.leftColor = data.leftColor?.toHexString?.() ?? data.leftColor;
    data.rightColor = data.rightColor?.toHexString?.() ?? data.rightColor;
    data.platforms = data.platforms ?? [];
    setGames((games) => games.map((g) => (g.id === id ? { id, ...data } : g)));
  }, {});

  return (
    <div className="h-screen">
      <div className="py-3 text-center font-bold text-3xl">
        游戏发售时间表 编辑器
      </div>
      <div className="grid grid-cols-12 px-6 gap-x-3">
        <div className="col-span-4">
          <Card title="预览">
            <div
              id="gameList"
              style={{
                height: 'calc(100vh - 12rem)',
                overflow: 'auto',
              }}
            >
              <Skeleton loading={isLoading} active>
                <GameList
                  data={games}
                  onClickGame={(game) => {
                    setCurrentGameId(game.id ?? null);
                    form.resetFields();
                    form.setFieldsValue(
                      games.filter((g) => g.id === game.id)[0] ?? {},
                    );
                  }}
                  container={() => document.getElementById('gameList')}
                />
              </Skeleton>
            </div>
          </Card>
        </div>
        <div className="col-span-8">
          <Card
            title="编辑"
            extra={
              <Space>
                {currentGameId && (
                  <Popconfirm
                    title="确定删除？"
                    onConfirm={() => deleteGame(currentGameId)}
                    okText="删除"
                    okType="danger"
                  >
                    <Button key="remove" danger>
                      删除
                    </Button>
                  </Popconfirm>
                )}
                <Button key="add" type="primary" onClick={() => createGame()}>
                  添加
                </Button>
              </Space>
            }
          >
            {!currentGameId ? (
              <Empty>
                <Space>
                  <div>在左侧选择一款游戏</div>
                  <div>或</div>
                  <div>
                    <Button type="primary" onClick={() => createGame()}>
                      添加
                    </Button>
                  </div>
                </Space>
              </Empty>
            ) : (
              <div>
                <ProForm
                  grid
                  submitter={false}
                  form={form}
                  onValuesChange={() => {
                    updateGame.run(currentGameId, form.getFieldsValue());
                  }}
                >
                  <ProFormText name="title" label="标题" />
                  <ProFormFieldSet name="subtitle" label="副标题">
                    <ProFormText />
                    <ProFormText />
                  </ProFormFieldSet>
                  <ProFormDatePicker
                    name="releaseDate"
                    label="发售日期"
                    colProps={{ span: 6 }}
                    dataFormat={'YYYY.MM.DD'}
                  />
                  <ProFormCheckbox.Group
                    name="platforms"
                    label="平台"
                    options={[
                      { label: 'Steam', value: 'Steam' },
                      { label: 'Epic', value: 'Epic' },
                      { label: 'Xbox', value: 'Xbox' },
                      { label: 'Switch', value: 'Switch' },
                      { label: 'PlayStation', value: 'PlayStation' },
                      { label: 'Android', value: 'Android' },
                      { label: 'Apple', value: 'Apple' },
                    ]}
                    colProps={{ span: 12 }}
                  />
                  <ProFormCheckbox.Group
                    name="free"
                    label="会员免费"
                    options={[
                      { label: 'Xbox Game Pass', value: 'XGP' },
                      { label: 'PlayStation Plus', value: 'PSPlus' },
                    ]}
                    colProps={{ span: 6 }}
                  />
                  <ProFormText name="bg" label="背景" />
                  <ProFormText name="logo" label="Logo" />
                  <ProFormColorPicker
                    name="leftColor"
                    label="左侧颜色"
                    colProps={{ span: 12 }}
                    initialValue="black"
                  />
                  <ProFormColorPicker
                    name="rightColor"
                    colProps={{ span: 12 }}
                    label="右侧颜色"
                    initialValue="black"
                  />
                </ProForm>
                <div>
                  <div
                    className="w-full px-6"
                    style={{
                      maxWidth: '30rem',
                    }}
                  >
                    <Game
                      config={
                        games.filter((g) => g.id === currentGameId)[0] ?? {}
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
          <div className="h-2" />
          <Card
            title="Json"
            extra={
              <CopyToClipboard
                text={JSON.stringify(games, null, 2)}
                onCopy={() => message.success('已复制')}
              >
                <Button type="primary">复制</Button>
              </CopyToClipboard>
            }
          >
            <Input.TextArea
              value={JSON.stringify(games, null, 2)}
              onChange={(e) => {
                try {
                  let gs = JSON.parse(e.target.value) as GameType[];
                  setGames(gs);
                  form.setFieldsValue(
                    gs.filter((g) => g.id === currentGameId)[0] ?? {},
                  );
                } catch (e) {
                  console.error(e);
                }
              }}
              styles={{
                textarea: {
                  height: '12rem',
                },
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
