import { isEmpty } from '@deip/toolbox/lodash';

export const userHelpersMixin = {
  methods: {
    /**
     *
     * @param {Object} user
     * @returns {null | string}
     */
    $$userFullName(user) {
      if (!user || isEmpty(user)) return null;

      const firstName = this.$attributes.getMappedData('user.firstName', user.attributes)?.value;
      const lastName = this.$attributes.getMappedData('user.lastName', user.attributes)?.value;

      if (firstName || lastName) {
        return `${firstName} ${lastName}`;
      }
      return user._id;
    },

    /**
    * @param {Object} user
    * @param {Object} opts - add this parameter if you need to crop the image on the server
    * @param {number} opts.width
    * @param {number} opts.height
    * @param {boolean} opts.image
    * @returns {null | string}
    */
    $$userAvatarSrc(user, opts = {}) {
      if (!user || isEmpty(user)) return null;

      const avatar = this.$attributes.getMappedData(
        'user.avatar',
        user.attributes
      );

      if (!avatar) return null;

      return this.$attributes.getFileSrc({
        scope: 'user',
        scopeId: user._id,
        attributeId: avatar.attributeId,
        filename: avatar.value,
        ...opts
      });
    }
  }
};
