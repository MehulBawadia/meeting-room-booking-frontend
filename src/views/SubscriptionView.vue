<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { toast } from 'vue3-toastify';
import API from '@/services/API.js';
import { useAuthStore } from '@/stores/auth';

const subscriptionList = ref([]);

const authUser = useAuthStore();
const subscribedId = computed(() => authUser.user?.subscription_id);

const btnDisabled = ref(false);
const fetchSubscriptionList = async () => {
  const response = await API.get(`/subscriptions`);
  subscriptionList.value = response.data.data;
};

const formData = reactive({
  subscription_id: '',
});

const subscribe = async (subscriptionId) => {
  btnDisabled.value = true;

  formData.subscription_id = subscriptionId;

  try {
    const response = await API.post('/subscriptions/buy', formData);
    if (response.data.status === 'success') {
      toast.success(response.data.message, {
        theme: 'colored',
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_LEFT,
      });

      await authUser.updateUserDetails(response.data.data.order.user);
    }
  } catch (e) {
    let message = 'Something went wrong.';
    if (e.response.status === 403) {
      formData.subscription_id = '';
      message = e.response.data.message;
    }
    toast.error(message, {
      theme: 'colored',
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    });
  } finally {
    btnDisabled.value = false;
  }
};

onMounted(() => {
  fetchSubscriptionList();
});
</script>

<template>
  <div>
    <header class="mt-4">
      <h1 class="text-2xl font-bold">Subscription</h1>
    </header>

    <table class="mt-8 table">
      <thead class="table-header">
        <tr>
          <th class="table-header-cell">Sr. No.</th>
          <th class="table-header-cell">Name</th>
          <th class="table-header-cell">Bookings Per Day</th>
          <th class="table-header-cell">Price</th>
          <th class="table-header-cell"></th>
        </tr>
      </thead>

      <tbody v-if="subscriptionList.length">
        <tr
          v-for="(subscription, index) in subscriptionList"
          :key="subscription.id"
          class="table-row"
        >
          <td class="table-row-cell">{{ ++index }}</td>
          <td class="table-row-cell capitalize">{{ subscription.name }}</td>
          <td class="table-row-cell">{{ subscription.booking_per_day }}</td>
          <td class="table-row-cell">{{ subscription.price }}</td>
          <td class="table-row-cell">
            <button
              v-if="subscribedId !== subscription.id"
              class="table-btn-subscribe"
              @click.prevent="subscribe(subscription.id)"
              :disabled="btnDisabled"
            >
              Subscribe
            </button>

            <button
              v-if="subscribedId === subscription.id"
              class="table-btn-subscribed"
            >
              Subscribed
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
