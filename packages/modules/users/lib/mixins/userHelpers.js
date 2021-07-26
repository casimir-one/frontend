import { isEmpty } from 'lodash/fp';

export const userHelpersMixin = {
  methods: {
    $$userFullName(user) {
      if (!user || isEmpty(user)) return null;

      const firstName = this.$attributes.getMappedData('userFirstName', user.attributes)?.value;
      const lastName = this.$attributes.getMappedData('userLastName', user.attributes)?.value;

      if (firstName || lastName) {
        return `${firstName} ${lastName}`;
      }
      return user.username;
    },

    $$userInitials(user) {
      const fullName = this.$$userFullName(user);

      if (!fullName) return '×';

      return fullName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    },

    $$userAvatarSrc(user, opts = {}) {
      if (!user || isEmpty(user)) return null;

      const avatar = this.$attributes.getMappedData(
        'userAvatar',
        user.attributes
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
