export const userHelpersMixin = {
  methods: {
    userFullName(user) {
      if (!user) return null;

      const firstName = this.$attributes.getMappedData('userFirstName', user.profile.attributes)?.value;
      const lastName = this.$attributes.getMappedData('userLastName', user.profile.attributes)?.value;

      if (firstName || lastName) {
        return `${firstName} ${lastName}`;
      }
      return user.account.name;
    },

    userInitials(user) {
      const fullName = this.userFullName(user);

      if (!fullName) return '×';

      return fullName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    },

    userAvatarSrc(user, opts = {}) {
      if (!user) return null;

      const avatar = this.$attributes.getMappedData(
        'userAvatar',
        user.profile.attributes
      );

      if (!avatar) return null;

      return this.$attributes.getFileSrc({
        scope: 'user',
        scopeId: user.username,
        attributeId: avatar.attributeId,
        filename: avatar.value,
        ...opts
      });
    }
  }
};
