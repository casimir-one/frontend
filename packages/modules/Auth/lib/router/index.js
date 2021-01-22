const templates = {
  signInComponent: { template: '<router-view />' },
  signUpComponent: { template: '<router-view />' }
};

export const authRouterFabric = (opts = {}) => {
  const options = {
    ...templates,
    ...opts
  };

  return [
    {
      path: '/sign-in',
      name: 'signIn',
      component: options.signInComponent,
      meta: { guest: true }
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: options.signUpComponent,
      meta: { guest: true }
    }
  ];
};

export const authRouter = authRouterFabric();
