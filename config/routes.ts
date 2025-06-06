

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user', routes: [
          {name: '登录', path: '/user/login', component: './user/Login'},
          {name: '注册', path: '/user/register', component: './user/Register'}
        ]
      },
      {component: './404'},
    ],
  },

  {
    path: '/welcome', 
    name: '欢迎页', 
    icon: 'smile', 
    component: './Welcome'
  },

  {
    path: '/notes',
    name: 'unswit课程笔记',
    icon: 'book',
    component: './Notes'
  },

  {
    path: '/forum',
    name: '论坛',
    icon: 'comment',
    routes: [
    {
      path: '/forum',
      component: './Forum',
    },
    {
      path: '/forum/:id',
      component: './Forum/PostDetail',
      name: '帖子详情',
      hideInMenu: true,
    },
  ],
  },

  {
    path: '/admin',
    layout: false,
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {path: '/admin/user-manage', name: '用户管理', icon: 'smile', component: './Admin/UserManage'},
      {component: './404'},
    ],
  },

  { path: '/', 
    redirect: '/welcome'
  },

  {
    path: '/account',
    routes: [
      {
        path: '/account/center',
        name: '个人中心',
        component: './Account/Center',
      },
      {
        path: '/account/settings',
        name: '个人设置',
        component: './Account/Settings',
      }
    ]

  },
  
  {component: './404'},
];
