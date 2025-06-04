<script setup>
defineProps({
  type: {
    type: String,
    default: () => 'text',
  },
  modelValue: String,
  labelText: String,
  name: String,
  placeholder: String,
  autofocus: Boolean,
  required: Boolean,
  errorText: String,
  disabled: Boolean,
  tabIndex: Number,
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <div class="flex justify-between">
      <label
        v-if="labelText"
        :for="name"
        class="label"
        >{{ labelText }}:</label
      >

      <slot name="forgotPasswordLink"></slot>
    </div>
    <input
      class="textbox"
      :class="{
        'border-red-500': errorText?.length,
        'border-gray-700': !errorText,
        'cursor-not-allowed': disabled,
      }"
      :type="type"
      :value="modelValue"
      :name="name"
      :id="name"
      :placeholder="placeholder"
      :required="required"
      :autofocus="autofocus"
      :disabled="disabled"
      :tabindex="tabIndex"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span
      v-if="errorText"
      class="input-error"
      >{{ errorText }}</span
    >
  </div>
</template>
