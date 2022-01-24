import { defineComponent } from '@deip/platform-util';
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
  text: AttributeTextSet,
  textarea: AttributeTextareaSet,
  richText: AttributeRichtextSet,
  select: AttributeSelectSet,
  switch: AttributeSwitchSet,
  checkbox: AttributeCheckboxSet,
  date: AttributeDateSet,
  dateTime: AttributeDateTimeSet,
  file: AttributeFileSet,
  image: AttributeImageSet,
  avatar: AttributeAvatarSet,
  location: AttributeLocationSet,
  url: AttributeUrlSet,
  number: AttributeNumberSet,
  videoUrl: AttributeVideoUrlSet,
  custom: AttributeCustomSet
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
