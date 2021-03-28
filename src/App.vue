<template>
  <router-view id="router-view"></router-view>
</template>

<script>
export default {
  name:"App",
  components:{
  }
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style lang="scss">
html, body, #app {
  padding: 0;
  margin: 0;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  height: 100%;
}
:root {
  --scrollBarWidth: 16px;
}

@media (hover: hover) and (pointer: fine) {
    .slimScroll {
      --scrollBarWidth: 10px !important;
    }
    ::-webkit-scrollbar {
        width: var(--scrollBarWidth);
        height: var(--scrollBarWidth);
    }
    ::-webkit-scrollbar-thumb {
        background-color: #979797;
        background-clip: padding-box;
        border: calc(var(--scrollBarWidth) / 4) solid transparent;
        border-radius: calc(var(--scrollBarWidth) / 2);
        box-shadow: none;
        min-height: 50px;
        transition: all 0.5s ease;
    }
    ::-webkit-scrollbar-button {
        width: 4px;
        height: 4px;
        background: none;
        border: none;
        display: none;
    }
    ::-webkit-scrollbar-track {
        background: none;
        border: none;
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
}

</style>