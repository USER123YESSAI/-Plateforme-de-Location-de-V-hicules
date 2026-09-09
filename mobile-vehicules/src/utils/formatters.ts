export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '0 FCFA';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return `${amount} FCFA`;
  // Formatage des milliers avec espace
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';
  const baseUrl = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = path.replace(/^\/?storage\//, '').replace(/^\//, '');
  return `${baseUrl}/storage/${cleanPath}`;
}
