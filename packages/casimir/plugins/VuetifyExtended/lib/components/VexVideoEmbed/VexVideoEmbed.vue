<template>
  <v-responsive
    v-if="videoUrl"
    :aspect-ratio="aspectRatio"
    v-bind="measurableProps"
  >
    <iframe
      class="pos-absolute fill-box"
      style="border: 0"
      allowfullscreen
      :src="videoUrl"
    />
  </v-responsive>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  /* eslint-disable */
  import Measurable from 'vuetify/lib/mixins/measurable';
  /* eslint-enable */
  export const allowedVideoServices = [
    {
      key: 'youtube',
      // eslint-disable-next-line no-useless-escape
      reg: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i,
      url: 'https://www.youtube.com/embed/$5',
      params: {
        'picture-in-picture': 1,
        accelerometer: 1,
        gyroscope: 1

      }
    },
    {
      key: 'vimeo',
      reg: /^.*vimeo.com\/(\d+)($|\/|\b)/i,
      url: 'https://player.vimeo.com/video/$1',
      params: {
        title: 0,
        byline: 0,
        portrait: 0
      }
    },

    {
      key: 'dailymotion',
      reg: /^.*(?:\/video|dai.ly)\/([A-Za-z0-9]+)([^#&?]*).*/i,
      url: 'https://www.dailymotion.com/embed/video/$1',
      params: {
        autoplay: 0
      }
    },

    {
      key: 'coub',
      reg: /^.*coub.com\/(?:embed|view)\/([A-Za-z0-9]+)([^#&?]*).*/i,
      url: 'https://coub.com/embed/$1',
      params: {
        autoplay: 0
      }
    }
  ];
  /**
   * The plugin allows you to embed videos
   * allowed platforms: youtube, vimeo, dailymotion, coub
   */
  export default defineComponent({
    name: 'VexVideoEmbed',
    props: {
      /**
       * Video aspect ratio
       * Sets a base aspect ratio, calculated as width/height
       * @example 1.7778 for 16/9
       */
      aspectRatio: {
        type: Number,
        default: 16 / 9
      },

      ...Measurable.options.props,
      /**
       * Video URL.
       * This prop is mandatory
       * Allowed platforms: youtube, vimeo, dailymotion, coub
       */
      src: {
        type: String,
        required: true,
        default: undefined
      },
      /**
       * Additional video options if available
       */
      params: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      measurableProps() {
        return Object.keys(Measurable.options.props)
          .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
      },

      videoUrl() {
        const videoObj = allowedVideoServices.find((v) => v.reg.test(this.src));

        if (videoObj) {
          const params = { ...videoObj.params, ...this.params };
          const query = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
          const and = videoObj.url.indexOf('?') >= 0 ? '&' : '?';

          return this.src.replace(videoObj.reg, videoObj.url) + and + query;
        }

        console.warn('No video settings find');

        return null;
      }
    }
  });
</script>
