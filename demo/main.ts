import { createApp } from 'vue';
import MyApp from './app.vue';
import { Tabs, Tab } from '../src';

createApp(MyApp)
  .component('ui-tabs', Tabs as any)
  .component('ui-tab', Tab as any)
  .mount('#app');