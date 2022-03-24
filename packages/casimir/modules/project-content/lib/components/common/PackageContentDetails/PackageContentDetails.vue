<template>
  <div>
    <div class="text-caption text--secondary text-truncate mb-4">
      {{ content.hash }}
    </div>
    <v-list>
      <v-list-item v-for="file in content.packageFiles" :key="file.hash">
        <v-list-item-content>
          <v-row>
            <v-col cols="10">
              <ve-line-clamp :lines="1">
                <a
                  v-if="isPreviewAvailable(file.ext)"
                  target="_blank"
                  class="a"
                  :href="getContentUrl(file.hash)"
                >

                  {{ file.filename }}
                </a>
                <span v-else class="text-body-2">
                  {{ file.filename }}
                </span>
              </ve-line-clamp>
            </v-col>
            <v-col class="text-align-right">
              <vex-tooltip
                :tooltip="$t('module.projectContent.details.download')"
                bottom
              >
                <v-btn
                  icon
                  small
                  download
                  :href="getContentUrl(file.hash, true)"
                >
                  <v-icon small>
                    mdi-download
                  </v-icon>
                </v-btn>
              </vex-tooltip>
              <span class="text-body-2 grey--text ml-2">{{ file.hash.slice(0, 8) }}</span>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexTooltip } from '@deip/vuetify-extended';
  import { VeLineClamp } from '@deip/vue-elements';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();
  /**
   * Component for package content details
   */
  export default defineComponent({
    name: 'PackageContentDetails',

    components: {
      VexTooltip,
      VeLineClamp
    },

    props: {
      /**
       * Content info
       */
      content: {
        type: Object,
        required: true
      }
    },

    methods: {
      /**
       * Check if preview is available by file extension
       *
       * @param {string} ext
       */
      isPreviewAvailable(ext) {
        return ['.png', '.jpg', '.jpeg', '.pdf'].some((e) => e === ext);
      },
      /**
       * Get content url by file hash
       *
       * @param {string} fileHash
       * @param {boolean} download
       */
      getContentUrl(fileHash, download = false) {
        const { DEIP_SERVER_URL } = this.$env;

        return `${DEIP_SERVER_URL}/api/v2/project-content/package/${this.content._id}/${fileHash}?download=${download}&authorization=${accessService.getAccessToken()}`;
      }
    }
  });
</script>
