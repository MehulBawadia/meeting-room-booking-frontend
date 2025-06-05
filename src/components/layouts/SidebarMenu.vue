<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import InlineSvg from 'vue-inline-svg';
import { useAuthStore } from '@/stores/auth';
import { AppLogo } from '@/assets/images';
import { IconLogout, IconDashboard, IconMenuBar, IconClose } from '@/assets/svg-icons';

const route = useRoute();
const isActiveLink = (name) => {
  return route.name === name;
};

const authStore = useAuthStore();
const logoutUser = async () => {
  await authStore.logoutUser();

  if (!authStore.authUser) {
    toast.success('User logged out successfully.', {
      theme: 'colored',
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      onClose: () => (window.location = '/login'),
    });
  }
};

const links = [
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: IconDashboard,
    text: 'Dashboard',
  },
  {
    name: 'bookMeetingRoom',
    path: '/meeting-rooms/book',
    icon: IconDashboard,
    text: 'Book Meeting Room',
  },
  {
    name: 'myBookings',
    path: '/meeting-rooms/my-bookings',
    icon: IconDashboard,
    text: 'My Bookings',
  },
  {
    name: 'subscription',
    path: '/subscription',
    icon: IconDashboard,
    text: 'Subscription',
  },
];

let displayMobileMenu = ref(false);
const toggleMenu = () => {
  displayMobileMenu.value = !displayMobileMenu.value;
};
</script>

<template>
  <div
    class="w-full xl:w-1/6 bg-white xl:rounded-tr-xl xl:rounded-br-xl shadow shadow-gray-500 overflow-hidden"
  >
    <div class="px-6 border-b flex items-center justify-between h-16">
      <div class="flex items-center">
        <InlineSvg
          :src="AppLogo"
          class="w-8 h-8 stroke-indigo-600"
        />
        <span class="ml-2 text-2xl xl:text-2xl font-bold text-indigo-600 uppercase italic"
          >Meeting Room</span
        >
      </div>
      <div class="xl:hidden">
        <button
          type="button"
          @click.prevent="toggleMenu"
        >
          <InlineSvg
            v-if="!displayMobileMenu"
            :src="IconMenuBar"
            class="w-8 h-8"
          />
          <InlineSvg
            v-if="displayMobileMenu"
            :src="IconClose"
            class="w-8 h-8"
          />
        </button>
      </div>
    </div>

    <div
      class="mt-4 xl:mt-8 px-3"
      :class="{ 'hidden xl:block': !displayMobileMenu }"
    >
      <RouterLink
        v-for="(link, index) in links"
        :key="link.name"
        :to="link.path"
        class="flex items-center px-3 py-2 rounded-lg group hover:bg-indigo-100"
        :class="{
          'bg-indigo-100': isActiveLink(link.name),
          'mt-2': index !== 0,
        }"
      >
        <InlineSvg
          :src="link.icon"
          class="w-6 h-6 mr-2 flex items-center group-hover:stroke-indigo-800"
          :class="{
            'stroke-indigo-800 font-semibold': isActiveLink(link.name),
            'stroke-gray-400': !isActiveLink(link.name),
          }"
        />
        <span
          class="group-hover:text-indigo-800"
          :class="{
            'text-indigo-800': isActiveLink(link.name),
            'text-gray-500': !isActiveLink(link.name),
          }"
          >{{ link.text }}</span
        >
      </RouterLink>

      <div class="w-full border-b border-gray-100 my-3"></div>

      <button
        class="w-full cursor-pointer mt-2 flex items-center text-indigo-600 px-3 py-2 rounded-lg group hover:bg-indigo-100"
        @click="logoutUser()"
      >
        <InlineSvg
          :src="IconLogout"
          class="w-6 h-6 fill-gray-500 group-hover:fill-indigo-800"
        />
        <span class="ml-2 text-gray-500 group-hover:text-indigo-800">Logout</span>
      </button>
    </div>
  </div>
</template>
