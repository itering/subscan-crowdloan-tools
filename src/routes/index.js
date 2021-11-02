export default [{
    name: "root",
    path: "/",
    component: () =>
      import( /* webpackChunkName: "home" */ "Views/Crowdloan/index")
  },
  {
    name: "crowdloan",
    path: "/crowdloan",
    component: () => import( /* webpackChunkName: "createWallet" */ "Views/Crowdloan/index")
  },
  {
    name: "404",
    path: "/404",
    component: () => import( /* webpackChunkName: "404" */ "Views/ErrorPage/404")
  },
  {
    name: "noData",
    path: "/noData",
    component: () => import( /* webpackChunkName: "noData" */ "Views/ErrorPage/noData")
  },
  {
    path: "*",
    redirect: "/404"
  }
];
