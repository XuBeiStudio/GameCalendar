import Game from '@/components/Game';
import Markdown from '@/components/Markdown';
import { parseBadge } from '@/pages/GameDetails';
import { getGames } from '@/utils/api';
import { GameDataType } from '@/utils/types';
import { useQuery } from '@@/exports';
import {
  ProForm,
  ProFormCheckbox,
  ProFormColorPicker,
  ProFormDatePicker,
  ProFormFieldSet,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useLocalStorageState, useThrottleFn } from 'ahooks';
import {
  App,
  Button,
  Card,
  Empty,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Skeleton,
  Space,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';

const Page: React.FC = () => {
  const [form] = ProForm.useForm();
  const { message } = App.useApp();

  const [draft, setDraft] = useLocalStorageState<GameDataType[]>('draft', {
    defaultValue: [],
  });

  const { data: baseData, isLoading } = useQuery(
    ['gameDatas'],
    async () => getGames(),
    {
      refetchOnWindowFocus: false,
    },
  );

  const [games, setGames] = useState<GameDataType[]>([]);

  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const currentGame = useMemo(
    () => games.filter((g) => g.id === currentGameId)[0] ?? {},
    [games, currentGameId],
  );

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (baseData) {
      setGames(baseData);
    }
  }, [baseData]);

  const createGame = useCallback(() => {
    const id = uuidv4();
    setGames([...games, { id }]);
    setCurrentGameId(id);
    form.resetFields();
  }, [games]);

  const deleteGame = useCallback(
    (id: string) => {
      setGames(games.filter((g) => g.id !== id));
      setCurrentGameId(null);
    },
    [games],
  );

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
    data.markdown = data.markdown ?? '';

    let tmp = data.name ?? [];
    data.name = [];
    for (let i of tmp) {
      if (!/^.{2}_.{2}$/.test(i.lang)) {
        continue;
      }
      data.name.push(i);
    }

    setGames((games) => games.map((g) => (g.id === id ? { id, ...data } : g)));
  }, {});

  const selectGame = useCallback(
    (id: string) => {
      setCurrentGameId(id ?? '');
      form.resetFields();

      let fields: any = games.filter((g) => g.id === id)[0] ?? {};

      form.setFieldsValue(fields);
    },
    [games],
  );

  return (
    <div className="h-screen">
      <div className="py-3 text-center font-bold text-3xl">
        游戏发售时间表 编辑器
      </div>
      <div className="grid grid-cols-12 px-6 gap-x-3">
        <div className="col-span-2">
          <Card
            title="游戏库"
            extra={
              <Space>
                <Input
                  placeholder="搜索"
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  value={search}
                />
                <Button type="primary" onClick={() => createGame()}>
                  添加
                </Button>
              </Space>
            }
          >
            <div
              id="gameList"
              style={{
                height: 'calc(100vh - 12rem - 24rem)',
                overflow: 'auto',
              }}
            >
              <Skeleton loading={isLoading} active>
                <Menu
                  items={
                    games
                      .filter((game) => game.title?.includes(search))
                      .map((game) => ({
                        key: game.id,
                        label: game.title,
                      })) as any
                  }
                  onSelect={(info) => {
                    selectGame(info.key);
                  }}
                />
              </Skeleton>
            </div>
          </Card>
          <div className="h-2" />
          <Card
            title="Json"
            extra={
              <Space>
                <Button.Group>
                  <Button
                    onClick={() => {
                      setDraft(games);
                      message.success('已保存');
                    }}
                  >
                    保存草稿
                  </Button>
                  <Button
                    onClick={() => {
                      setGames(draft ?? []);
                      form.setFieldsValue(
                        (draft ?? []).filter(
                          (g) => g.id === currentGameId,
                        )[0] ?? {},
                      );
                    }}
                  >
                    加载草稿
                  </Button>
                </Button.Group>
                <CopyToClipboard
                  text={JSON.stringify(games, null, 2)}
                  onCopy={() => message.success('已复制')}
                >
                  <Button type="primary">复制</Button>
                </CopyToClipboard>
              </Space>
            }
          >
            <Input.TextArea
              value={JSON.stringify(games, null, 2)}
              onChange={(e) => {
                try {
                  let gs = JSON.parse(e.target.value) as GameDataType[];
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
        <div className="col-span-10">
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
              </Space>
            }
          >
            <div
              className="overflow-y-auto"
              style={{
                height: 'calc(55vh - 4rem)',
              }}
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
                    submitter={false}
                    form={form}
                    onValuesChange={() => {
                      updateGame.run(currentGameId, form.getFieldsValue());
                    }}
                  >
                    <div className="grid grid-cols-12 gap-x-4">
                      <div className="col-span-6">
                        <ProFormText name="title" label="标题" />
                        <ProFormFieldSet name="subtitle" label="副标题">
                          <ProFormText />
                          <ProFormText />
                        </ProFormFieldSet>
                      </div>
                      <div className="col-span-6">
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
                        />
                        <ProFormCheckbox.Group
                          name="free"
                          label="会员免费"
                          options={[
                            { label: 'Xbox Game Pass', value: 'XGP' },
                            { label: 'PlayStation Plus', value: 'PSPlus' },
                          ]}
                        />
                      </div>
                      <div className="col-span-2">
                        <ProFormDatePicker
                          name="releaseDate"
                          label="发售日期"
                          dataFormat={'YYYY.MM.DD'}
                        />
                      </div>
                      <div className="col-span-2">
                        <ProFormColorPicker
                          name="leftColor"
                          label="左侧颜色"
                          initialValue="black"
                        />
                      </div>
                      <div className="col-span-2">
                        <ProFormColorPicker
                          name="rightColor"
                          label="右侧颜色"
                          initialValue="black"
                        />
                      </div>
                      <div className="col-span-3">
                        <ProFormText name="bg" label="背景" />
                      </div>
                      <div className="col-span-3">
                        <ProFormText name="logo" label="Logo" />
                      </div>
                      <div className="col-span-3">
                        <ProFormList name="name" label="游戏名称">
                          <div className="grid grid-cols-3 gap-x-2">
                            <div className="col-span-1">
                              <ProFormText
                                name="lang"
                                label="语言"
                                placeholder="例如：zh_CN"
                              />
                            </div>
                            <div className="col-span-2">
                              <ProFormText name="content" label="内容" />
                            </div>
                          </div>
                        </ProFormList>
                      </div>
                      <div className="col-span-3">
                        <ProFormList name="developer" label="开发商">
                          <ProFormText name="name" />
                        </ProFormList>
                      </div>
                      <div className="col-span-3">
                        <ProFormList name="publisher" label="发行商">
                          <ProFormText name="name" />
                        </ProFormList>
                      </div>
                      <div className="col-span-3">
                        <ProFormList name="badges" label="徽章">
                          <div className="grid grid-cols-2 gap-x-2">
                            <div>
                              <ProFormSelect
                                name="type"
                                label="类型"
                                options={[
                                  {
                                    label: 'Steam商城页',
                                    value: 'store.steam',
                                  },
                                  {
                                    label: 'Epic商城页',
                                    value: 'store.epic',
                                  },
                                  {
                                    label: 'Bilibili',
                                    value: 'video.bilibili',
                                  },
                                  {
                                    label: 'Youtube',
                                    value: 'video.youtube',
                                  },
                                  {
                                    label: 'Spotify歌单',
                                    value: 'music.spotify.playlist',
                                  },
                                  {
                                    label: 'Spotify歌曲',
                                    value: 'music.spotify.track',
                                  },
                                ]}
                              />
                            </div>
                            <div>
                              <ProFormText name="value" label="值" />
                            </div>
                          </div>
                        </ProFormList>
                      </div>
                      <div className="col-span-12">
                        <ProFormTextArea name="markdown" label="Markdown" />
                      </div>
                    </div>
                  </ProForm>
                </div>
              )}
            </div>
          </Card>
          <div className="h-2" />
          <Card title="预览">
            <Modal
              title="预览 Markdown"
              open={openPreviewModal}
              onCancel={() => setOpenPreviewModal(false)}
              footer={false}
              destroyOnClose
            >
              <Markdown
                markdown={currentGame.markdown ?? ''}
                components={{
                  img: (props: any) => (
                    <img
                      {...props}
                      style={{
                        maxWidth: '100%',
                      }}
                      alt="img"
                    />
                  ),
                }}
              />
            </Modal>
            <div
              className="overflow-y-auto"
              style={{
                height: 'calc(30vh - 4rem)',
              }}
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
                  <div className="py-2">
                    <Button onClick={() => setOpenPreviewModal(true)}>
                      Markdown
                    </Button>
                  </div>
                  <div className="py-2 flex gap-x-2">
                    {currentGame.badges?.map((badge) => parseBadge(badge))}
                  </div>
                  <div>
                    <div
                      className="w-full px-6"
                      style={{
                        maxWidth: '30rem',
                      }}
                    >
                      <Game config={currentGame} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
