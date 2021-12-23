import { defineComponent } from '@deip/platform-util';
import { ATTR_TYPES } from '@deip/constants';

import { AttributeRootComponentMixinFactory } from '../mixins';
import { AttributeTextRead } from './AttributeText';
import { AttributeTextareaRead } from './AttributeTextarea';
import { AttributeSelectRead } from './AttributeSelect';
import { AttributeAvatarRead } from './AttributeAvatar';
import { AttributeCustomRead } from './AttributeCustom';
import { AttributeSwitchRead } from './AttributeSwitch';
import { AttributeCheckboxRead } from './AttributeCheckbox';
import { AttributeDateRead } from './AttributeDate';
import { AttributeDateTimeRead } from './AttributeDateTime';
import { AttributeFileRead } from './AttributeFile';
import { AttributeImageRead } from './AttributeImage';
import { AttributeUrlRead } from './AttributeUrl';
import { AttributeNumberRead } from './AttributeNumber';
import { AttributeVideoUrlRead } from './AttributeVideoUrl';
import { AttributeRichtextRead } from './AttributeRichtext';

const componentsMap = {
  [ATTR_TYPES.TEXT]: AttributeTextRead,
  [ATTR_TYPES.TEXTAREA]: AttributeTextareaRead,
  [ATTR_TYPES.SELECT]: AttributeSelectRead,
  [ATTR_TYPES.SWITCH]: AttributeSwitchRead,
  [ATTR_TYPES.CHECKBOX]: AttributeCheckboxRead,
  [ATTR_TYPES.DATE]: AttributeDateRead,
  [ATTR_TYPES.DATE_TIME]: AttributeDateTimeRead,
  [ATTR_TYPES.FILE]: AttributeFileRead,
  [ATTR_TYPES.IMAGE]: AttributeImageRead,
  [ATTR_TYPES.AVATAR]: AttributeAvatarRead,
  [ATTR_TYPES.URL]: AttributeUrlRead,
  [ATTR_TYPES.NUMBER]: AttributeNumberRead,
  [ATTR_TYPES.VIDEO_URL]: AttributeVideoUrlRead,
  [ATTR_TYPES.CUSTOM]: AttributeCustomRead,
  [ATTR_TYPES.RICHTEXT]: AttributeRichtextRead
};

const AttributeRead = defineComponent({
  name: 'AttributeRead',

  mixins: [
    AttributeRootComponentMixinFactory(componentsMap)
  ],

  methods: {
    genFallback() {
      return (
        <div>{this.internalValue}</div>
      );
    }
  }
});

export default AttributeRead;
export { AttributeRead };
