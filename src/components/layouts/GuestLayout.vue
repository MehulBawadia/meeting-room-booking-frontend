<script setup></script>

<template>
  <div>
    <RouterView v-slot="{ Component }">
      <Transition
        name="fade"
        mode="out-in"
      >
        <component :is="Component"></component>
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
