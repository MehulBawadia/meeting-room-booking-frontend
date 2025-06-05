<script setup>
import { onMounted, ref } from 'vue';
import API from '@/services/API.js';

const stats = ref([]);

const fetchDailyBookingStats = async () => {
  const response = await API.get('/meeting-rooms/daily-stats');

  stats.value = response.data.data;
};

onMounted(() => {
  fetchDailyBookingStats();
});
</script>

<template>
  <div>
    <header class="mt-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </header>

    <div class="mt-8">
      <div class="text-xl font-semibold">Daily Booking Stats</div>

      <div class="mt-6 flex justify-between">
        <div class="bg-white shadow rounded px-4 py-4 flex items-center justify-between space-x-6">
          <div class="text-gray-600 text-xl font-medium tracking-wider">
            Total Bookings Per Day:
          </div>
          <div class="text-indigo-600 font-bold text-6xl">{{ stats.per_day_booking_count }}</div>
        </div>

        <div class="bg-white shadow rounded px-4 py-4 flex items-center justify-between space-x-6">
          <div class="text-gray-600 text-xl font-medium tracking-wider">Total Booking Today:</div>
          <div class="text-red-600 font-bold text-6xl">{{ stats.today_booking_count }}</div>
        </div>

        <div class="bg-white shadow rounded px-4 py-4 flex items-center justify-between space-x-6">
          <div class="text-gray-600 text-xl font-medium tracking-wider">Available Booking:</div>
          <div class="text-green-600 font-bold text-6xl">{{ stats.available_booking_count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
