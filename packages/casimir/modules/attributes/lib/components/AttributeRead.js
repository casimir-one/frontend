import { defineComponent } from '@deip/platform-util';

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
  text: AttributeTextRead,
  textarea: AttributeTextareaRead,
  richText: AttributeRichtextRead,
  select: AttributeSelectRead,
  switch: AttributeSwitchRead,
  checkbox: AttributeCheckboxRead,
  date: AttributeDateRead,
  dateTime: AttributeDateTimeRead,
  file: AttributeFileRead,
  image: AttributeImageRead,
  avatar: AttributeAvatarRead,
  url: AttributeUrlRead,
  number: AttributeNumberRead,
  videoUrl: AttributeVideoUrlRead,
  custom: AttributeCustomRead
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
