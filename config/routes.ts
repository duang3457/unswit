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
    component: './Forum'
  },

  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {path: '/admin/user-manage', name: '用户管理', icon: 'smile', component: './Admin/UserManage'},
      {component: './404'},
    ],
  },

  // {
  //   name: '查询表格', 
  //   icon: 'table', 
  //   path: '/list', 
  //   component: './TableList'
  // },

  { path: '/', 
    redirect: '/welcome'
  },
  
  {component: './404'},
];
