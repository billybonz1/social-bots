<script setup>
  import { Head, Link, useForm } from "@inertiajs/inertia-vue3"
  import LayoutAuthenticated from "@/Layouts/LayoutAuthenticated.vue"
  import SectionMain from "@/Components/SectionMain.vue"
  import {InertiaLink} from "@inertiajs/inertia-vue3";
  import { Inertia } from '@inertiajs/inertia'
</script>

<template>
  <LayoutAuthenticated>
    <Head title="Create Job" />
    <SectionMain>
      <h2 class="block font-bold mb-2">Select job type:</h2>
      <select class="px-3 py-2 max-w-full focus:ring focus:outline-none rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800 border-gray-700" v-model="job_type">
        <option></option>
        <option value="send_message">Send message</option>
      </select>

      <div v-if="job_type === 'send_message'" class="mt-3">
        <div class="smc flex">
          <div class="facebook-friends-list border px-3 py-3">
            <h2 class="block font-bold mb-2">Friends List</h2>
            <div class="ffl-container" v-if="friends && friends.data.length > 0">
              <div v-for="friend in friends.data" :key="friend.id" class="facebook-friend"  :id="'friend' + friend.id">
                <input type="checkbox" @change="(e) => addFriend(friend, e)" :checked="friendAdded(friend.id)" style="margin-right: 10px;">
                <a :href="friend.url" target="_blank">
                  {{ friend.name }}
                </a>
              </div>
              <TailwindPagination  align="center" :data="friends" @pagination-change-page="getFriends" />
            </div>
            <div v-else class="center">
              Friends list is empty
            </div>
          </div>

          <div class="facebook-friends-list border px-3 py-3">
            <h2 class="block font-bold mb-2">Added Friends List</h2>
            <div class="ffl-container" v-if="friends && addedFriends.length > 0">
              <div v-for="friend in addedFriends" :key="friend.id" class="facebook-friend">
                <a :href="friend.url" target="_blank">
                  {{ friend.name }}
                </a>
                <a style="color: blue;margin-left: 10px;cursor:pointer;" @click="removeFriend(friend)">X</a>
              </div>
            </div>
            <div v-else class="center">
              Added Friends list is empty
            </div>
          </div>

          <div class="message-to-send border px-3 py-3">
            <h2 class="block font-bold mb-2">Message to Send</h2>
            <textarea v-model="message" class="px-3 py-2 max-w-full focus:ring focus:outline-none rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800 border-gray-700"></textarea>
          </div>
        </div>

        <button :disabled="sendMessageDisabled()" style="min-width: 127.58px" @click="sendMessage()" class="inline-flex cursor-pointer justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border rounded ring-green-700 bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 hover:bg-green-700 hover:border-green-700 hover:dark:bg-green-600 hover:green:border-green-600 py-2 px-3 mr-3 last:mr-0 mb-3 mt-3" type="button" :class="{loading: sendMessageLoading}">Send Message</button>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
import { TailwindPagination } from 'laravel-vue-pagination'
export default {
  props: {
    _token: {
      type: String
    }
  },
  components:{
    TailwindPagination
  },
  data () {
    return {
      job_type: "",
      friends: {
        data: []
      },
      addedFriends: [],
      addedFriendsIds: [],
      message: "",
      sendMessageLoading: false
    }
  },
  async mounted(){
    await this.getFriends()
  },
  methods: {
    async sendMessage(){
      if(!this.sendMessageLoading){
        this.sendMessageLoading = true
        try {
          const response = await fetch('/admin/facebook/sendMessage', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
              _token: this._token,
              addedFriendsIds: this.addedFriendsIds,
              message: this.message
            })
          });
          let data = await response.json(); // parses JSON response into native
          if(data.status){
            Inertia.visit('/admin/facebook');
          }
          this.sendMessageLoading = false
        } catch {
        }
      }
    },
    sendMessageDisabled(){
      return this.addedFriendsIds.length === 0 || this.message === ""
    },
    friendAdded(id){
      return this.addedFriendsIds.indexOf(id) > -1
    },
    addFriend(friend, e){
      if(e.target.checked){
        this.addedFriends.push(friend);
        this.addedFriendsIds.push(friend.id);
      }else{
        this.removeFriend(friend);
      }
    },
    removeFriend(friend){
      let index = this.addedFriends.indexOf(friend);
      this.addedFriends.splice(index, 1);
      let indexId = this.addedFriendsIds.indexOf(friend.id);
      this.addedFriendsIds.splice(indexId, 1);
    },
    async getFriends(page = 1){
      try {
        const response = await fetch('/admin/facebook/getFriends?page=' + page, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        this.friends = await response.json(); // parses JSON response into native
      } catch {
      }
    },
  }
}
</script>
