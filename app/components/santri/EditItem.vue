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
  <div class="group flex flex-col md:flex-row md:items-center py-3 border-b border-white/[0.03] last:border-0">
    <label class="md:w-1/3 text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 md:mb-0 group-hover:text-orange-500 transition-colors">
      {{ label }}
    </label>
    
    <div class="md:w-2/3">
      <input
        :type="type || 'text'"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full bg-white/[0.02] border border-white/5 rounded-lg px-4 py-2 text-white text-sm outline-none focus:bg-orange-500/5 focus:border-orange-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed placeholder:text-slate-700"
      />
    </div>
  </div>
</template>