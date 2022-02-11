import SignIn from '@/modules/auth/components/SignIn';
import SignUp from '@/modules/auth/components/SignUp';
import PasswordRestore from '@/modules/auth/components/PasswordRestore';

const viewSetup = {
  appBar: { type: 'backOnly' },
  sideBar: { disabled: true }
};

export const authRouter = [
  {
    path: '/sign-in',
    name: 'signIn',
    component: SignIn,
    meta: {
      guestOnly: true,
      viewSetup
    }
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: SignUp,
    meta: {
      guestOnly: true,
      viewSetup
    }
  },
  {
    path: '/password-restore',
    name: 'passwordRestore',
    component: PasswordRestore,
    meta: {
      guestOnly: true,
      viewSetup
    }
  }
];
