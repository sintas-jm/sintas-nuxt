<template>
  <div class="container">
    <h2>Rekap Pendaftar Santri</h2>
    
    <div v-if="pending">Memuat data...</div>
    
    <div v-else class="table-responsive">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Lengkap</th>
            <th>Jenjang</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pendaftar" :key="item.id_pendaftar">
            <td>{{ item.id_pendaftar }}</td>
            <td>{{ item.nama_lengkap }}</td>
            <td>{{ item.jenjang_daftar }}</td>
            <td>{{ item.status_pendaftaran }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// Mengambil data secara otomatis saat halaman dibuka
const { data: pendaftar, pending } = await useFetch('/api/pendaftaran')
</script>

<style scoped>
  .table-container { overflow-x: auto; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
  th { background: #fafafa; }
  .badge { background: #e0e0e0; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
</style>