<template>
  <div class='tabs'>  
    <div class='tabs-headers'>      
      <div v-for='tab of tabs' 
           :key='tab.$key'
           class='tabs-header' :class='{ "tabs-active": tab.$key === active }'
           @click='setActive(tab)'>
        <RenderSlot :slot='tab.header' />
      </div>
    </div>
    <div v-for='tab of tabs' :key='tab.$key' v-show='tab.$key === active'>
      <RenderSlot :slot='tab.body' />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, ref, Slot, watch } from 'vue';
import { hideRefs } from '../reactivity/hideRefs';
import { toObjects, RenderSlot } from './declarative';

interface TabData {
  $key: string;
  body: Slot;
  header: string | Slot;
  active: boolean;
}

let uid = 0;

export const Tab = defineComponent({
  props: {
    id: String,
    header: String,
  },
  setup(props, ctx) {
    const $key = props.id || 'tab$' + (++uid);
    return () => {      
      return h('tab', {
        key: $key,  // key to ensure proper patching of objects
        $key,       // $key to be able to bind in template (key is automatically removed)
        // Slots
        body: ctx.slots.default, 
        header: ctx.slots.header,
        // Properties:
        ...props,
      });
    }
  },
});

export const Tabs = defineComponent({
  props: {
    active: String,
  },

  components: { RenderSlot: <any>RenderSlot }, // Casting? A TS or Vue bug :(  

  setup(props, { slots, emit }) {
    const tabs = toObjects<TabData>(slots.default!);

    // Because we can't count on active being bound, even less so v-model bound, 
    // we can't rely on props.active and must ensure we have internal storage of what tab is active.
    const active = ref(props.active || tabs[0]?.$key);
    watch(() => props.active, newValue => active.value = newValue!);

    return hideRefs({
      tabs,
      active,

      setActive(tab: TabData) {
        active.value = tab.$key;
        emit('update:active', tab.$key);
      }
    });
  },
});

export default Tabs;
</script>

<style>
.tabs {
  display: flex;
  flex-direction: column;
}

.tabs-headers {
  border-bottom: solid 1px #ccc;
  margin-bottom: 8px;  
}

.tabs-header {
  display: inline-block;
  padding: 8px 16px;
  margin-bottom: -1;
  cursor: pointer;
  color: #888;
  position: relative;
}

.tabs-header:after {
  content: '';
  position: absolute;
  right: 0;
  top: calc(50% - 6px);
  height: 12px;
  border-left: solid 1px #ccc;
}

.tabs-active {
  border-bottom: solid 2px #1f9cd6;
  margin-bottom: -1px;
  font-weight: 600;
  color: inherit;
}
</style>