<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
});

const emit = defineEmits(['page-change']);

const pages = computed(() => {
  const total = props.lastPage;
  const current = props.currentPage;
  const range = [];

  const delta = 2; // pages to show before and after current

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i);
  }

  return range;
});

const changePage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.lastPage) {
    emit('page-change', page);
  }
};
</script>

<template>
  <div class="flex justify-center mt-6 space-x-2">
    <button
      class="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="[
        'px-3 py-1 rounded transition',
        page === currentPage
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
    >
      {{ page }}
    </button>

    <button
      class="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
      :disabled="currentPage === lastPage"
      @click="changePage(currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>
