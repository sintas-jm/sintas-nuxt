<script setup lang="ts">
defineProps<{
  label: string
  modelValue: any
  type?: string
  disabled?: boolean
  placeholder?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="space-y-1.5">
    <label class="text-[10px] uppercase font-black text-slate-500 ml-1 tracking-widest">
      {{ label }}
    </label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50 transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
    />
  </div>
</template>