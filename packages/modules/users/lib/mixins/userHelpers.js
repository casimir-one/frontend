import { isEmpty } from '@deip/toolbox/lodash';
import { ATTR_SCOPES } from '@deip/constants';

export const userHelpersMixin = {
  methods: {
    /**
     *
     * @param {object} user
     * @returns {null | string}
     */
    $$userFullName(user) {
      if (!user || isEmpty(user)) return null;

      const firstName = this.$attributes.getMappedData('userFirstName', user.attributes)?.value;
      const lastName = this.$attributes.getMappedData('userLastName', user.attributes)?.value;

      if (firstName || lastName) {
        return `${firstName} ${lastName}`;
      }
      return user.username;
    },

    /**
     *
     * @param {object} user
     * @returns {string}
     */
    $$userInitials(user) {
      const fullName = this.$$userFullName(user);

      if (!fullName) return '×';

      return fullName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    },

    /**
    * @param {object} user
    * @param {object} opts - add this parameter if you need to crop the image on the server
    * @param {number} opts.width
    * @param {number} opts.height
    * @param {boolean} opts.image
    * @returns {null | string}
    */
    $$userAvatarSrc(user, opts = {}) {
      if (!user || isEmpty(user)) return null;

      const avatar = this.$attributes.getMappedData(
        'userAvatar',
        user.attributes
      );

      if (!avatar) return null;

      return this.$attributes.getFileSrc({
        scope: ATTR_SCOPES.USER,
        scopeId: user.username,
        attributeId: avatar.attributeId,
        filename: avatar.value,
        ...opts
      });
    }
  }
};
