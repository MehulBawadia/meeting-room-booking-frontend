<script setup>
import SidebarMenu from '@/components/layouts/SidebarMenu.vue';
</script>

<template>
  <div class="flex flex-col xl:flex-row min-h-screen dark:bg-gray-900">
    <SidebarMenu />

    <div class="w-full xl:w-5/6 flex flex-col flex-1 justify-between">
      <div>
        <main>
          <RouterView v-slot="{ Component }">
            <Transition
              name="fade"
              mode="out-in"
            >
              <component :is="Component"></component>
            </Transition>
          </RouterView>
        </main>
      </div>

      <footer class="text-center py-4">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Copyright &copy; {{ new Date().getFullYear() }}. All Rights Reserved. Meeting Room
          Booking.<br />
          Designed and Developed by
          <a
            href="https://github.com/MehulBawadia"
            target="_blank"
            class="text-indigo-600 hover:text-indigo-800 focus:text-indigo-800 focus:ring-0 focus:shadow-none dark:text-gray-400 dark:hover:text-gray-200 dark:focus:text-gray-200 dark:focus:ring-0 dark:focus:shadow-none dark:focus:outline-none transition ease-in-out duration-300"
            rel="noopener"
            >Mehul Bawadia</a
          >
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
