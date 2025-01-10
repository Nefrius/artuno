export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(timestamp))
}

export function calculatePercentageChange(currentPrice: number, previousPrice: number): number {
  return ((currentPrice - previousPrice) / previousPrice) * 100
}

export function formatPercentage(percentage: number): string {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`
}

export function shortenNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  const intervals = {
    yıl: 31536000,
    ay: 2592000,
    hafta: 604800,
    gün: 86400,
    saat: 3600,
    dakika: 60,
    saniye: 1
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? '' : ''} önce`
    }
  }
  
  return 'şimdi'
} 