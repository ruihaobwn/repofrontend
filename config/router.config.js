export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/stock/goods' },
//      {
//        path: '/dashboard',
//        name: 'dashboard',
//        icon: 'dashboard',
//        routes: [
//          {
//            path: '/dashboard/analysis',
//            name: 'analysis',
//            component: './Dashboard/Analysis',
//          },
//          {
//            path: '/dashboard/monitor',
//            name: 'monitor',
//            component: './Dashboard/Monitor',
//          },
//          {
//            path: '/dashboard/workplace',
//            name: 'workplace',
//            component: './Dashboard/Workplace',
//          },
//        ],
//      },
//    库存
      {
        path: '/stock',
        name: 'stock',
        icon: 'table',
        routes: [
          {
            path: '/stock/goods',
            name: 'goods',
            component: './Repo/ShopList'
          },
          {
            path: '/stock/record',
            name: 'record',
            component: './Repo/ShopRecordList'
          },
        ]
      },
      //商品售出
      {
        path: '/sale',
        name: 'sale',
        icon: 'table',
        routes: [
//          {
//            path: 'sale/commodity',
//            name: 'commodity',
//            component: './Repo/CommodityList'
//          },
          {
            path: '/sale/product',
            name: 'product',
            component: './Repo/ProductList'
          },
//          {
//            path: '/sale/record',
//            name: 'record',
//            component: './Repo/SaleRecordList'
//          },
        ]
     },
      //货品管理
      {
        path: '/shop',
        name: 'shop',
        icon: 'pic-right',
        routes: [
          {
            path: '/shop/send',
            name: 'send',
            component: './Repo/SendOutList'
          },
          {
            path: '/shop/order',
            name: 'order',
            component: './Repo/ShopOrder'
          }
        ]
      },
      // forms
//      {
//        path: '/form',
//        icon: 'form',
//        name: 'form',
//        routes: [
//          {
//            path: '/form/basic-form',
//            name: 'basicform',
//            component: './Forms/BasicForm',
//          },
//          {
//            path: '/form/step-form',
//            name: 'stepform',
//            component: './Forms/StepForm',
//            hideChildrenInMenu: true,
//            routes: [
//              {
//                path: '/form/step-form',
//                name: 'stepform',
//                redirect: '/form/step-form/info',
//              },
//              {
//                path: '/form/step-form/info',
//                name: 'info',
//                component: './Forms/StepForm/Step1',
//              },
//              {
//                path: '/form/step-form/confirm',
//                name: 'confirm',
//                component: './Forms/StepForm/Step2',
//              },
//              {
//                path: '/form/step-form/result',
//                name: 'result',
//                component: './Forms/StepForm/Step3',
//              },
//            ],
//          },
//          {
//            path: '/form/advanced-form',
//            name: 'advancedform',
//            component: './Forms/AdvancedForm',
//          },
//        ],
//      },
      // list
//      {
//        path: '/list',
//        icon: 'table',
//        name: 'list',
//        routes: [
//          {
//            path: '/list/table-list',
//            name: 'searchtable',
//            component: './List/TableList',
//          },
//          {
//            path: '/list/basic-list',
//            name: 'basiclist',
//            component: './List/BasicList',
//          },
//          {
//            path: '/list/card-list',
//            name: 'cardlist',
//            component: './List/CardList',
//          },
//          {
//            path: '/list/search',
//            name: 'searchlist',
//            component: './List/List',
//            routes: [
//              {
//                path: '/list/search/articles',
//                name: 'articles',
//                component: './List/Articles',
//              },
//              {
//                path: '/list/search/projects',
//                name: 'projects',
//                component: './List/Projects',
//              },
//              {
//                path: '/list/search/applications',
//                name: 'applications',
//                component: './List/Applications',
//              },
//            ],
//          },
//        ],
//      },
//      {
//        path: '/profile',
//        name: 'profile',
//        icon: 'profile',
//        routes: [
//          // profile
//          {
//            path: '/profile/basic',
//            name: 'basic',
//            component: './Profile/BasicProfile',
//          },
//          {
//            path: '/profile/advanced',
//            name: 'advanced',
//            component: './Profile/AdvancedProfile',
//          },
//        ],
//      },
//      {
//        name: 'result',
//        icon: 'check-circle-o',
//        path: '/result',
//        routes: [
//          // result
//          {
//            path: '/result/success',
//            name: 'success',
//            component: './Result/Success',
//          },
//          { path: '/result/fail', name: 'fail', component: './Result/Error' },
//        ],
//      },
//      {
//        name: 'exception',
//        icon: 'warning',
//        path: '/exception',
//        routes: [
//          // exception
//          {
//            path: '/exception/403',
//            name: 'not-permission',
//            component: './Exception/403',
//          },
//          {
//            path: '/exception/404',
//            name: 'not-find',
//            component: './Exception/404',
//          },
//          {
//            path: '/exception/500',
//            name: 'server-error',
//            component: './Exception/500',
//          },
//          {
//            path: '/exception/trigger',
//            name: 'trigger',
//            hideInMenu: true,
//            component: './Exception/TriggerException',
//          },
//        ],
//      },
//      {
//        name: 'account',
//        icon: 'user',
//        path: '/account',
//        routes: [
//          {
//            path: '/account/center',
//            name: 'center',
//            component: './Account/Center/Center',
//            routes: [
//              {
//                path: '/account/center',
//                redirect: '/account/center/articles',
//              },
//              {
//                path: '/account/center/articles',
//                component: './Account/Center/Articles',
//              },
//              {
//                path: '/account/center/applications',
//                component: './Account/Center/Applications',
//              },
//              {
//                path: '/account/center/projects',
//                component: './Account/Center/Projects',
//              },
//            ],
//          },
//          {
//            path: '/account/settings',
//            name: 'settings',
//            component: './Account/Settings/Info',
//            routes: [
//              {
//                path: '/account/settings',
//                redirect: '/account/settings/base',
//              },
//              {
//                path: '/account/settings/base',
//                component: './Account/Settings/BaseView',
//              },
//              {
//                path: '/account/settings/security',
//                component: './Account/Settings/SecurityView',
//              },
//              {
//                path: '/account/settings/binding',
//                component: './Account/Settings/BindingView',
//              },
//              {
//                path: '/account/settings/notification',
//                component: './Account/Settings/NotificationView',
//              },
//            ],
//          },
//        ],
//      },
      {
        component: '404',
      },
    ],
  },
];
