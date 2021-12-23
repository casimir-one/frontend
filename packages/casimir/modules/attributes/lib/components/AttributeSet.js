import { defineComponent } from '@deip/platform-util';
import { ATTR_TYPES } from '@deip/constants';
import { AttributeModelMixin, AttributeRootComponentMixinFactory } from '../mixins';

import { AttributeTextSet } from './AttributeText';
import { AttributeTextareaSet } from './AttributeTextarea';
import { AttributeSelectSet } from './AttributeSelect';
import { AttributeRichtextSet } from './AttributeRichtext';
import { AttributeAvatarSet } from './AttributeAvatar';
import { AttributeImageSet } from './AttributeImage';
import { AttributeLocationSet } from './AttributeLocation';
import { AttributeSwitchSet } from './AttributeSwitch';
import { AttributeCheckboxSet } from './AttributeCheckbox';
import { AttributeDateSet } from './AttributeDate';
import { AttributeDateTimeSet } from './AttributeDateTime';
import { AttributeFileSet } from './AttributeFile';
import { AttributeUrlSet } from './AttributeUrl';
import { AttributeNumberSet } from './AttributeNumber';
import { AttributeVideoUrlSet } from './AttributeVideoUrl';
import { AttributeCustomSet } from './AttributeCustom';

const componentsMap = {
  [ATTR_TYPES.TEXT]: AttributeTextSet,
  [ATTR_TYPES.TEXTAREA]: AttributeTextareaSet,
  [ATTR_TYPES.SELECT]: AttributeSelectSet,
  [ATTR_TYPES.SWITCH]: AttributeSwitchSet,
  [ATTR_TYPES.CHECKBOX]: AttributeCheckboxSet,
  [ATTR_TYPES.DATE]: AttributeDateSet,
  [ATTR_TYPES.DATE_TIME]: AttributeDateTimeSet,
  [ATTR_TYPES.FILE]: AttributeFileSet,
  [ATTR_TYPES.IMAGE]: AttributeImageSet,
  [ATTR_TYPES.AVATAR]: AttributeAvatarSet,
  [ATTR_TYPES.RICHTEXT]: AttributeRichtextSet,
  [ATTR_TYPES.LOCATION]: AttributeLocationSet,
  [ATTR_TYPES.URL]: AttributeUrlSet,
  [ATTR_TYPES.NUMBER]: AttributeNumberSet,
  [ATTR_TYPES.VIDEO_URL]: AttributeVideoUrlSet,
  [ATTR_TYPES.CUSTOM]: AttributeCustomSet
};

const AttributeSet = defineComponent({
  name: 'AttributeSet',

  mixins: [
    AttributeRootComponentMixinFactory(componentsMap),
    AttributeModelMixin
  ]
});

export default AttributeSet;
export { AttributeSet };
