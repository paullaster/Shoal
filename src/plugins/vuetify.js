import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css'



export default createVuetify(
  {
    icons: {
      defaultSet: 'mdi',
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#ED1E79',
            secondary: '#2B5AA6',
            info: '#2196F3',
            warning: '#FB8C00',
            danger: '#FF5252',
            support: '#000000',
          }
        }
      }
    }
  }
);
