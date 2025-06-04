<script setup>
defineProps({
  text: String,
  disabled: Boolean,
});
</script>

<template>
  <button
    class="btn-submit"
    :disabled="disabled"
  >
    <span
      v-if="disabled"
      class="btn-submit-loader"
      role="status"
      aria-label="loading"
    ></span>

    <span
      v-else
      class="btn-submit-text"
    >
      {{ text }}
    </span>
  </button>
</template>
