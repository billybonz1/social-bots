<script setup>
import AsideMenuItem from '@/Components/AsideMenuItem.vue'
import { useMainStore } from '@/Stores/main.js'


defineProps({
  isDropdownList: Boolean,
  menu: {
    type: Array,
    default: () => []
  }
})

const mainStore = useMainStore()

const emit = defineEmits(['menu-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

</script>

<template>
  <ul>
    <AsideMenuItem
      v-for="(item, index) in menu"
      :key="index"
      :item="item"
      :is-dropdown-list="isDropdownList"
      @menu-click="menuClick"
    />
  </ul>
</template>


<script>
export default {
  mounted () {
    console.log(this.permissions)
  }
}
</script>
