import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TestComponentLargeMixins extends Vue {
  showConsoleLog() {
    // eslint-disable-next-line no-console
    console.log('TestComponentLarge clicked');
  }
}
