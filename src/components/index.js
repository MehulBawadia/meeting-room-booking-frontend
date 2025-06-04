import { defineAsyncComponent } from 'vue';

const TextInput = defineAsyncComponent(() => import('@/components/forms/TextInput.vue'));
const SubmitButton = defineAsyncComponent(() => import('@/components/forms/SubmitButton.vue'));

export { TextInput, SubmitButton };
