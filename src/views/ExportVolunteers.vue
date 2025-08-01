<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">تصدير بيانات المتطوعين</h1>
    <div class="space-x-4">
      <button @click="exportJSON" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">تصدير كـ JSON</button>
      <button @click="exportCSV" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">تصدير كـ CSV</button>
    </div>
  </div>
</template>

<script setup>
const exportJSON = () => {
  const data = localStorage.getItem('volunteers') || '[]'
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'volunteers.json'
  a.click()
  URL.revokeObjectURL(url)
}

const exportCSV = () => {
  const data = JSON.parse(localStorage.getItem('volunteers') || '[]')
  if (data.length === 0) return

  const headers = Object.keys(data[0]).filter(k => k !== 'id')
  const csv = [
    headers.join(','),
    ...data.map(v => headers.map(h => `"${Array.isArray(v[h]) ? v[h].join('|') : v[h]}"`).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'volunteers.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>