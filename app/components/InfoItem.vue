<script setup lang="ts">
defineProps<{ label: string, value: any }>()
</script>

<template>
  <div class="group">
    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">
      {{ label }}
    </label>
    <div class="text-slate-200 text-sm md:text-lg font-medium leading-relaxed">
      {{ value || '-' }}
    </div>
  </div>
</template>

<!-- dipakai di :
- app/pages/internal/santri/[id].vue


v1
<template>
  <div class="group">
    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">
      {{ label }}
    </label>
    <div class="text-slate-200 text-sm md:text-lg font-medium leading-relaxed">
      {{ value || '-' }}
    </div>
  </div>
</template>

v2
<template>
  <div class="group border-b border-white/[0.03] py-3 md:flex md:items-center md:justify-between">
    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-0 md:w-1/3 group-hover:text-orange-500 transition-all">
      {{ label }}
    </label>
    <div class="text-slate-200 text-sm md:text-base font-medium leading-relaxed md:w-2/3 md:text-right">
      {{ value || '-' }}
    </div>
  </div>
</template>

-->