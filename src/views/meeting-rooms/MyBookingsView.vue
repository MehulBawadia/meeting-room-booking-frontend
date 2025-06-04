<script setup>
import { onMounted, ref } from 'vue';
import API from '@/services/API.js';
import Pagination from '@/components/PaginationView.vue';

const filter = ref('upcoming');
const bookings = ref([]);

const paginationMeta = ref({ current_page: 1, last_page: 1 });

const handlePageChange = async (page) => {
  await fetchMyBookings(filter.value, page);
};

const toggleBookingType = async (page) => {
  filter.value = filter.value === 'upcoming' ? 'past' : 'upcoming';

  await fetchMyBookings(filter.value, page);
};

const fetchMyBookings = async (type, pageNumber) => {
  const response = await API.get(`/bookings?filter=${type}&page=${pageNumber}`);
  bookings.value = response.data.data;

  paginationMeta.value = response.data.meta;
};

const mounted = ref(false);
onMounted(async () => {
  if (!bookings.value.length && !mounted.value) {
    mounted.value = true;
    await fetchMyBookings(filter.value, 1);
  }
});
</script>

<template>
  <div>
    <header class="mt-4">
      <h1 class="text-2xl font-bold">My Bookings</h1>
    </header>

    <div class="mt-8 text-lg flex items-center space-x-1">
      <div>Viewing {{ filter }} bookings.</div>

      <div
        v-if="filter === 'upcoming'"
        class="cursor-pointer inline-block text-indigo-600"
        @click.prevent="toggleBookingType"
      >
        Show past bookings
      </div>

      <div
        v-if="filter === 'past'"
        class="cursor-pointer inline-block text-indigo-600"
        @click.prevent="toggleBookingType"
      >
        Show upcoming bookings
      </div>
    </div>

    <div class="mt-8">
      <table class="table">
        <thead class="table-header">
          <tr>
            <th class="table-header-cell">Sr. No.</th>
            <th class="table-header-cell">Name of Meeting</th>
            <th class="table-header-cell">Meeting Room Name</th>
            <th class="table-header-cell">No. of Members</th>
            <th class="table-header-cell">Start at</th>
            <th class="table-header-cell">End at</th>
          </tr>
        </thead>

        <tbody v-if="bookings.length">
          <tr
            v-for="(booking, index) in bookings"
            :key="booking.id"
            class="table-row"
          >
            <td class="table-row-cell">{{ ++index }}</td>
            <td class="table-row-cell">{{ booking.name_of_meeting }}</td>
            <td class="table-row-cell">{{ booking.meeting_room.name }}</td>
            <td class="table-row-cell">{{ booking.number_of_members }}</td>
            <td class="table-row-cell">{{ booking.start_time }}</td>
            <td class="table-row-cell">{{ booking.end_time }}</td>
          </tr>
        </tbody>

        <tbody v-if="!bookings.length">
          <tr class="table-row">
            <td
              class="table-row-cell text-center"
              colspan="6"
            >
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="bookings.length">
      <Pagination
        :currentPage="paginationMeta.current_page"
        :lastPage="paginationMeta.last_page"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
