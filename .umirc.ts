import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  reactQuery: {},
  routes: [
    {
      path: '/editor',
      component: '@/pages/Editor',
    },
    {
      path: '/',
      component: '@/pages/Index',
    },
    {
      path: '/game/:id',
      component: '@/pages/GameDetails',
    },
  ],
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
  },
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
  npmClient: 'yarn',
  history: {
    type: 'hash',
  },
  analytics: {
    ga_v2: 'G-BB6KZMZJHH',
  },
  headScripts: [
    {
      content: `(function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};
                    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, 'clarity', 'script', 'kvnnd4aolm');`,
    },
    {
      content: `var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?d8aac719318a2ab263c70b6c90cdf563";
                  var s = document.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(hm, s);
                })();`,
    },
  ],
});
