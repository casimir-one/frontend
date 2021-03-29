<script>
  import { attributeRead } from '../../mixins/base';

  export default {
    name: 'AttributeTextRead',
    mixins: [attributeRead],
    props: {
      clamped: {
        type: [Number, String],
        default: null
      }
    }
  };
</script>
