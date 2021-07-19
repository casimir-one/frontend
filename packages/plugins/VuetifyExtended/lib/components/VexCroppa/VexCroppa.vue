<script>
  // TODO: Perhaps in the future it will be rewritten to own
  import { defineComponent } from '@deip/platform-fns';
  // eslint-disable-next-line import/no-duplicates
  import component from 'vue-croppa/src/cropper?vue&type=script';
  // eslint-disable-next-line import/no-webpack-loader-syntax,import/no-duplicates
  import template from '!raw-loader!vue-loader!vue-croppa/src/cropper?vue&type=template';
  // import render from 'vue-croppa/src/cropper.vue?vue&type=template' // return undefined :(

  component.template = template;

  export default defineComponent({
    name: 'VexCroppa',
    extends: component,
    methods: {
      _autoSizingInit() { // hotfix
        this.$nextTick(() => {
          this._setContainerSize();
          window.addEventListener('resize', this._setContainerSize);
        });
      }
    }
  });
</script>

<style lang="scss">
  .croppa-container {
    display: inline-block;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    font-size: 0;
    align-self: flex-start;
    background-color: #e6e6e6;

    canvas {
      transition: all 0.3s;
    }

    &:hover {
      opacity: 0.7;
    }

    &.croppa--dropzone {
      box-shadow: inset 0 0 10px #333;

      canvas {
        opacity: 0.5;
      }
    }

    &.croppa--disabled-cc {
      cursor: default;

      &:hover {
        opacity: 1;
      }
    }

    &.croppa--has-target {
      cursor: move;

      &:hover {
        opacity: 1;
      }

      &.croppa--disabled-mz {
        cursor: default;
      }
    }

    &.croppa--disabled {
      cursor: not-allowed;

      &:hover {
        opacity: 1;
      }
    }

    &.croppa--passive {
      cursor: default;

      &:hover {
        opacity: 1;
      }
    }

    svg {
      &.icon-remove {
        position: absolute;
        background: #fff;
        border-radius: 50%;
        filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.7));
        z-index: 10;
        cursor: pointer;
        border: 2px solid #fff;
      }
    }
  }

  .sk-fading-circle {
    $circleCount: 12;
    $animationDuration: 1s;

    position: absolute;

    .sk-circle {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    .sk-circle .sk-circle-indicator {
      display: block;
      margin: 0 auto;
      width: 15%;
      height: 15%;
      border-radius: 100%;
      animation: sk-circleFadeDelay $animationDuration infinite ease-in-out both;
    }

    @for $i from 2 through $circleCount {
      .sk-circle#{$i} {
        transform: rotate(360deg / $circleCount * ($i - 1));
      }
    }

    @for $i from 2 through $circleCount {
      .sk-circle#{$i} .sk-circle-indicator {
        animation-delay: -$animationDuration + $animationDuration / $circleCount * ($i - 1);
      }
    }
  }

  @keyframes sk-circleFadeDelay {
    0%,
    39%,
    100% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
  };
</style>
