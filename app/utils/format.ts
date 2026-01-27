/**
 * Helper universal untuk konversi ID Google Drive menjadi URL Thumbnail.
 * Menghindari redline TypeScript dengan mengembalikan string kosong jika ID tidak valid.
 */
export const formatFotoUrl = (fotoId: any): string => {
  if (!fotoId) return ""
  
  const idStr = String(fotoId).trim()
  
  if (idStr === "" || idStr === "-") return ""
  
  // Jika sudah berupa link (http), langsung kembalikan
  if (idStr.includes('http')) return idStr
  
  // Format standard Google Drive Thumbnail
  return `https://drive.google.com/thumbnail?id=${idStr}&sz=s400`
}

/** CARA PAKAI 
Cukup panggil formatFotoUrl()

 * Di Template Vue:
    <img 
      v-if="formatFotoUrl(p.foto_profil)" 
      :src="formatFotoUrl(p.foto_profil)" 
    />

 * Di dalam Composable lain (jika butuh logic tambahan)
    const url = formatFotoUrl(item.foto)
 * 
 * */