<script setup>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth';
import { AppLogo, LoginSideBar } from '@/assets/images';
import { TextInput, SubmitButton } from '@/components';

let errors = ref([]);

const rules = {
  email: {
    required: helpers.withMessage('The email address field is required.', required),
    email: helpers.withMessage('The email address provided is invalid.', email),
  },
  password: { required: helpers.withMessage('The password field is required.', required) },
};
const formData = reactive({
  email: '',
  password: '',
});
const v$ = useVuelidate(rules, formData);

const authStore = useAuthStore();

const getErrorMessage = (field) => {
  if (!errors.value[field]?.length) {
    return v$.value[field].$errors[0].$message ?? '';
  }

  return errors.value[field]?.length ? errors.value[field][0] : '';
};

const btnDisabled = ref(false);
const loginUser = async () => {
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

    await authStore.loginUser({
      email: formData.email,
      password: formData.password,
    });

    if (authStore.authUser) {
      formData.email = '';
      formData.password = '';

      v$.value.$reset();

      toast.success('User logged in successfully.', {
        theme: 'colored',
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        onClose: () => (window.location = '/dashboard'),
      });
    }
  } catch (e) {
    let message = '';
    console.log(e);
    if (e.response.status === 401) {
      formData.password = '';
      v$.value.$reset();
      message = e.response.data.message;
    }
    if (e.response.status === 422) {
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
</script>

<template>
  <div>
    <div class="flex w-full min-h-screen">
      <div class="w-full lg:w-1/2 xl:w-2/5 px-8 xl:px-16 flex flex-1 flex-col justify-between">
        <div class="mt-8 lg:mt-16">
          <div class="flex items-center">
            <img
              :src="AppLogo"
              class="w-10 h-10 stroke-indigo-600"
            />
            <h1 class="ml-2 text-2xl xl:text-3xl font-bold text-indigo-600 uppercase italic">
              Meeting Room Booking
            </h1>
          </div>

          <h1 class="mt-6 lg:mt-12 text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">
            Welcome Back! Login To Your Account
          </h1>

          <div class="mt-6 lg:mt-12">
            <form @submit.prevent="loginUser">
              <TextInput
                labelText="Email address"
                type="email"
                name="email"
                v-model="formData.email"
                :tabIndex="1"
                :autofocus="true"
                :errorText="
                  errors?.email?.length || v$?.email?.$errors?.length
                    ? getErrorMessage('email')
                    : ''
                "
              />

              <div class="mt-6">
                <TextInput
                  labelText="Password"
                  type="password"
                  name="password"
                  :tabIndex="2"
                  v-model="formData.password"
                  :errorText="
                    errors?.password?.length || v$?.password?.$errors?.length
                      ? getErrorMessage('password')
                      : ''
                  "
                >
                </TextInput>
              </div>

              <div class="mt-6 flex items-center">
                <SubmitButton
                  text="Login"
                  widthClass="w-36"
                  bgColorClass="bg-indigo-600 hover:bg-indigo-800 focus:bg-indigo-800"
                  :disabled="btnDisabled"
                />

                <RouterLink
                  to="/"
                  class="ml-4 text-red-600 hover:text-red-800 focus:text-red-800 transition ease-in-out duration-300"
                  >Cancel</RouterLink
                >
              </div>
            </form>
          </div>
        </div>

        <div class="mb-8 text-sm text-center text-gray-700">
          Copyright &copy; {{ new Date().getFullYear() }}. All Rights Reserved. Meeting Room
          Booking.
        </div>
      </div>

      <div class="hidden lg:block lg:w-1/2 xl:w-3/5 rounded-tl-3xl rounded-bl-3xl overflow-hidden">
        <img
          :src="LoginSideBar"
          alt="Teamly HRMS login sidebar"
          class="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>
