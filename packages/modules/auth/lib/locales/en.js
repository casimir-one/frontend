export default {
  module: {
    auth: {
      signUp: 'Sign up',
      signIn: 'Sign in',
      signOut: 'Sign out',
      noAccountQuestion: 'No account?',
      haveAccountQuestion: 'Already have an account?',
      forgotPasswordQuestion: 'Forgot password?',
      password: 'Password',
      email: 'Email',
      message: 'Message',
      restore: 'Restore',
      resetPassword: {
        title: 'Change password',
        oldPasswordLabel: 'Old password',
        newPasswordLabel: 'New password',
        repeatPasswordLabel: 'Repeat new password',
        submitBtn: 'Change Password',
        cancelBtn: 'Cancel',
        oldInvalid: 'Old password is invalid',
        succChanged: 'Password successfully changed!',
        errChaged: 'Oops! Something went wrong. Please try again later',
        fieldRules: {
          required: 'This field is required',
          masterPasswordMinLength: 'Master password should be at least 10 symbols',
          masterPasswordMaxLength: 'Master password max length is 100 symbols',
          repeatMasterPassword: 'Password didn`t match. Try again.'
        }
      }
    }
  }
};
