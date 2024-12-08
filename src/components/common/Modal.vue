<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="modelValue" 
         class="fixed inset-0 bg-black/50 backdrop-blur-sm 
                flex items-center justify-center z-50"
         @click="$emit('update:modelValue', false)">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue"
             class="w-full max-w-5xl bg-white/90 dark:bg-gray-800/90 
                    backdrop-blur-md rounded-2xl shadow-xl"
             :class="[width || 'max-w-2xl']"
             @click.stop>
          <slot></slot>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  width: String
})

defineEmits(['update:modelValue'])
</script> 