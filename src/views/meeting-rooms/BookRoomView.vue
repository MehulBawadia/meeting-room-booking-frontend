<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, helpers } from '@vuelidate/validators';
import { toast } from 'vue3-toastify';
import { TextInput, SubmitButton } from '@/components';
import API from '@/services/API.js';

const minDateTime = ref('');

function getDateTimeValueForValidation() {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function getNowDateTime() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const formatted = formatter.format(new Date());
  return new Date(formatted.replace(',', ''));
}

const formData = reactive({
  start_time: '',
  duration: '',
  members: '1',
  name_of_meeting: '',
  meeting_room_id: '',
});

const rules = {
  start_time: {
    required: helpers.withMessage('The date and time field is required.', required),
  },
  duration: {
    required: helpers.withMessage('The duration field is required.', required),
  },
  members: {
    required: helpers.withMessage('The members field is required.', required),
    minValue: helpers.withMessage('The members field must be at least 1.', minValue('1')),
  },
};
const v$ = useVuelidate(rules, formData);

let errors = ref([]);
const getErrorMessage = (field) => {
  if (!errors.value[field]?.length) {
    return v$.value[field].$errors[0]?.$message ?? '';
  }
  return errors.value[field]?.length ? errors.value[field][0] : '';
};

const meetingRooms = ref([]);
const btnDisabled = ref(false);

function isPastTimeSelected() {
  const selectedDate = new Date(formData.start_time);
  const nowTime = getNowDateTime();

  return selectedDate < nowTime;
}

const getAvailableRooms = async () => {
  btnDisabled.value = true;
  try {
    const formValidated = await v$.value.$validate();

    if (!formValidated) {
      toast.error('The form has errors.', {
        theme: 'colored',
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return false;
    }

    // Prevent selecting past datetime
    if (isPastTimeSelected()) {
      toast.error('You cannot select a past date or time.', {
        theme: 'colored',
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return false;
    }

    formData.start_time = formData.start_time.replace('T', ' ');

    const response = await API.get(
      `/meeting-rooms/available?start_time=${formData.start_time}&duration=${formData.duration}&members=${formData.members}`
    );

    if (response.data.status === 'success') {
      errors.value = [];
      v$.value.$reset();
      meetingRooms.value = response.data.data;
    } else {
      errors.value = [];
      v$.value.$reset();
      meetingRooms.value = [];
    }
  } catch (e) {
    let message = 'Something went wrong.';
    if (e.response?.status === 401) {
      v$.value.$reset();
      message = e.response.data.message;
    }
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors;
      message = 'The form has errors.';
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

const bookRoom = async (roomId) => {
  btnDisabled.value = true;
  try {
    const formValidated = await v$.value.$validate();

    if (!formValidated) {
      toast.error('The form has errors.', {
        theme: 'colored',
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return false;
    }

    if (isPastTimeSelected()) {
      toast.error('You cannot select a past date or time.', {
        theme: 'colored',
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return false;
    }

    formData.start_time = formData.start_time.replace('T', ' ');

    formData.meeting_room_id = roomId;

    const response = await API.post(`/meeting-rooms/book`, formData);

    if (response.data.status === 'success') {
      errors.value = [];
      v$.value.$reset();
      meetingRooms.value = [];
      toast.success(response.data.message, {
        theme: 'colored',
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  } catch (e) {
    let message = 'Something went wrong.';
    if ([401, 403].includes(e.response?.status)) {
      v$.value.$reset();
      message = e.response.data.message;
    }
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors;
      message = 'The form has errors.';
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
  const updateMin = () => {
    minDateTime.value = getDateTimeValueForValidation();
  };

  updateMin();
  setInterval(updateMin, 60 * 1000); // update every minute
});
</script>

<template>
  <div>
    <header class="mt-4">
      <h1 class="text-2xl font-bold">Book Meeting Room</h1>
    </header>

    <div class="mt-8">
      <div class="text-xl font-semibold">Search for Available Meeting Room</div>

      <form @submit.prevent="getAvailableRooms">
        <div class="mt-6 flex space-x-6">
          <div class="w-1/3">
            <label class="label mb-2">Date and Time:</label>
            <input
              type="datetime-local"
              id="datetime"
              v-model="formData.start_time"
              :min="minDateTime"
              class="textbox"
            />
            <span
              class="text-red-500"
              v-if="errors?.start_time?.length || v$?.start_time?.$errors?.length"
            >
              {{ getErrorMessage('start_time') }}
            </span>
          </div>

          <div class="w-1/3">
            <label class="label">Duration:</label>
            <select
              name="duration"
              class="textbox"
              v-model="formData.duration"
            >
              <option
                value="30"
                selected
              >
                30 minutes
              </option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
            <span
              class="text-red-500"
              v-if="errors?.duration?.length || v$?.duration?.$errors?.length"
            >
              {{ getErrorMessage('duration') }}
            </span>
          </div>

          <div class="w-1/3">
            <label class="label">Members:</label>
            <TextInput
              type="number"
              name="members"
              v-model="formData.members"
              :errorText="
                errors?.members?.length || v$?.members?.$errors?.length
                  ? getErrorMessage('members')
                  : ''
              "
            />
          </div>
        </div>

        <div class="mt-6">
          <TextInput
            type="text"
            name="name_of_meeting"
            labelText="Name of Meeting"
            v-model="formData.name_of_meeting"
            :errorText="
              errors?.name_of_meeting?.length || v$?.name_of_meeting?.$errors?.length
                ? getErrorMessage('name_of_meeting')
                : ''
            "
          />
        </div>

        <SubmitButton
          text="Search"
          class="mt-6"
          :disabled="btnDisabled"
        />
      </form>
    </div>

    <div class="mt-8">
      <table class="table">
        <thead class="table-header">
          <tr>
            <th class="table-header-cell">ID</th>
            <th class="table-header-cell">Name</th>
            <th class="table-header-cell">Capacity</th>
            <th class="table-header-cell"></th>
          </tr>
        </thead>

        <tbody v-if="meetingRooms.length">
          <tr
            v-for="room in meetingRooms"
            :key="room.id"
            class="table-row"
          >
            <td class="table-row-cell">{{ room.id }}</td>
            <td class="table-row-cell">{{ room.name }}</td>
            <td class="table-row-cell">{{ room.capacity }}</td>
            <td class="table-row-cell">
              <button
                class="table-btn-book-room"
                @click.prevent="bookRoom(room.id)"
                :disabled="btnDisabled"
              >
                Book Room
              </button>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr class="table-row">
            <td
              class="table-row-cell text-center"
              colspan="4"
            >
              No records found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.dp__input_wrap input.dp__input {
  padding: 8px 2.5rem !important;
}
</style>
