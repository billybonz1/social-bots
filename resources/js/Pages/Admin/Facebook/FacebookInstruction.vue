<script setup>
import { Head, Link, useForm } from "@inertiajs/inertia-vue3"
import LayoutAuthenticated from "@/Layouts/LayoutAuthenticated.vue"
import SectionMain from "@/Components/SectionMain.vue"
import { Inertia } from '@inertiajs/inertia'

const props = defineProps({
  _token: {
    type: String
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <Head title="Facebook Instruction" />
    <SectionMain>
      <p>1. Open https://m.facebook.com/ in incognito mode using Google Chrome browser</p>
      <p>2. Press "Command+Option+C" on Mac or "Control+Shift+C" on Windows</p>
      <p>3. Then we repeat the steps as in the screenshots below</p>
      <img v-for="img in 10" :src="'/images/' + img + '.jpg'" alt="" style="display: block;width: 100%;margin-bottom: 25px;margin-top: 25px;" />
    </SectionMain>
  </LayoutAuthenticated>
</template>
