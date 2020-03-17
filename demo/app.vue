<template>
  <h1>Playroom</h1>
  <ui-tabs v-model:active='active'>
    <ui-tab>
      <template #header>
        Reactivity <b class='badge'>{{counter}}</b>
      </template>
      <div>
        <input v-model='name' ref='$refs.input'> 
        Hello {{name}}.
      </div>
      <div><button @click='toggle'>Show middle tab</button> is {{third}}</div>
    </ui-tab>

    <ui-tab header='Middle' v-if='third'>
      Middle tab
    </ui-tab>

    <ui-tab header='Stuff' id='stuff-tab'>
      <div>This is non-bound state: <input /></div>
      <div><button @click='toggle'>Show middle tab</button> is {{third}}</div>      
    </ui-tab>
  </ui-tabs>
  <div>
    Active tab is: {{active}}
  </div>
</template>

<script lang="ts">
import { hideRefs, sref } from '../src';

export default {
  setup() {
    const data = hideRefs({ 
      active: sref('stuff-tab'),
      name: sref('jods'),
      input: sref<HTMLInputElement>(),
      third: sref(false),
      counter: sref(0),
      toggle() { data.third = !data.third; data.counter++; }
    });
    return data;
  }
}
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  margin: 0;
  padding: 12px;
}

h1 {
  margin: 0 0 12px 0;
}

.badge {
  background: #1f9cd6;
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8em;
  margin-left: 8px;
}
</style>