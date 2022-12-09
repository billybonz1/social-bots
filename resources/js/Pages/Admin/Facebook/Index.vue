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
    <Head title="Facebook" />
    <SectionMain>

      <div v-if="authStatus === null" class="facebook-loader">
        Checking facebook auth, wait...
      </div>

      <div class="mb-2" v-if="error" style="color: red;">
        {{ error }}
      </div>

      <div v-if="authStatus === false" class="facebook-auth-form">
        <h2 class="block font-bold mb-2">Auth data has expired. Please fill form with new Auth data.</h2>
        <form @submit.prevent="submitAuth">
          <div class="mb-2">
            <label for="cookie" class="block font-bold mb-2">Cookie:</label>
            <input id="cookie" v-model="cookie" class="px-3 py-2 max-w-full focus:ring focus:outline-none rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800 border-gray-700"/>
          </div>
          <div class="mb-2">
            <label for="user_agent" class="block font-bold mb-2">User Agent:</label>
            <input id="user_agent" v-model="userAgent" class="px-3 py-2 max-w-full focus:ring focus:outline-none rounded w-full dark:placeholder-gray-400 h-12 border bg-white dark:bg-slate-800 border-gray-700"/>
          </div>
          <button type="submit" class="inline-flex cursor-pointer justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border rounded ring-blue-700 bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 hover:bg-blue-700 hover:border-blue-700 hover:dark:bg-blue-600 hover:dark:border-blue-600 py-2 px-3 mr-3 last:mr-0 mb-3">Submit</button>
        </form>
      </div>

      <div v-if="authStatus === true" class="facebook-jobs">
        <div class="flex">
          <Link :href="'/admin/facebook/createJob'" class="inline-flex cursor-pointer justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border rounded ring-blue-700 bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 hover:bg-blue-700 hover:border-blue-700 hover:dark:bg-blue-600 hover:dark:border-blue-600 py-2 px-3 mr-3 last:mr-0 mb-3">Create Job</Link>
          <button style="min-width: 127.58px" @click="getFriendsList()" class="inline-flex cursor-pointer justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border rounded ring-green-700 bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 hover:bg-green-700 hover:border-green-700 hover:dark:bg-green-600 hover:green:border-green-600 py-2 px-3 mr-3 last:mr-0 mb-3" type="button" :class="{loading: friendsLoading}">Get friends list</button>
        </div>

        <div class="flex">
          <div class="facebook-friends-list border px-3 py-3">
            <h2 class="block font-bold mb-2">Friends List</h2>
            <div class="ffl-container" v-if="friends && friends.data.length > 0">
              <div v-for="friend in friends.data" class="facebook-friend">
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
          <div class="facebook-jobs border px-3 py-3" style="flex: 1">
            <h2 class="block font-bold mb-2">Jobs List</h2>
            <table v-if="jobs.data.length > 0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>URL</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in jobs.data">
                  <td>{{ job.id }}</td>
                  <td>{{ job.action }}</td>
                  <td><a :href="job.url">{{ job.url }}</a></td>
                  <td>{{ job.message }}</td>
                  <td :class="{yellow: job.status === 0, green: job.status === 1, error: job.status === 2}">
                    {{ job.status === 0 ? 'working' : job.status === 2 ? 'error' : 'finished' }}
                  </td>
                </tr>
                <tr>
                  <td colspan="5">
                    <TailwindPagination  align="center" :data="jobs" @pagination-change-page="getJobs" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="center">
              Jobs list is empty
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
import { TailwindPagination } from 'laravel-vue-pagination'
export default {
  data () {
    return {
      authStatus: null,
      cookie: null,
      userAgent: null,
      error: null,
      friendsLoading: false,
      friends: {
        data: []
      },
      jobs: {
        data: []
      },
      jobsPage: 1
    }
  },
  components:{
    TailwindPagination
  },
  async mounted () {
    await this.checkAuth()
    await this.getJobs()
    await this.getFriends()
    setInterval(() => {
      this.getJobs(this.jobsPage);
    }, 5000)
  },
  methods: {
    async checkAuth(){
      // Default options are marked with *
      const response = await fetch('/admin/facebook/checkAuth', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          _token: this._token
        })
      });
      let data = await response.json(); // parses JSON response into native
      this.authStatus = data.status
    },
    async submitAuth() {
      this.error = null;
      try {
        const response = await fetch('/admin/facebook/saveAuth', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            _token: this._token,
            cookie: this.cookie,
            userAgent: this.userAgent
          })
        });
        let data = await response.json(); // parses JSON response into native
        this.authStatus = null
        await this.checkAuth()
      } catch {
        this.error = 'Something wrong, try again.';
      }
    },
    async getFriends(page = 1){
      try {
        let response = await fetch('/admin/facebook/getFriends?page=' + page, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        this.friends = await response.json(); // parses JSON response into native
        console.log(this.friends)
      } catch {
      }
    },
    async getJobs(page = 1){
      try {
        let responseJobs = await fetch('/admin/facebook/getJobs?page=' + page, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        this.jobs = await responseJobs.json(); // parses JSON response into native
        this.jobsPage = page;
        console.log(this.jobs);
      } catch {
      }
    },
    async getFriendsList() {
      if(!this.friendsLoading){
        try {
          this.friendsLoading = true
          const response = await fetch('/admin/facebook/getFriendsList', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
              _token: this._token
            })
          });
          await this.getFriends()
          this.friendsLoading = false
        } catch {
          this.friendsLoading = false
        }
      }
    }
  }
}
</script>
