import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: false,
        icons: {
            iconfont: 'fa',
        },
        options: {
            customProperties: true,
        },
        // themes: {
        //     light: {
        //         blue: '#002579',
        //         'dark-grey': '#464646',
        //         green: '#00BE96',
        //         grey: '#EEE8E8',
        //         orange: '#FE5F5A',
        //         primary: '#FE5F5A',
        //         white: '#FFFFFF',
        //     },
        // },
    },
})