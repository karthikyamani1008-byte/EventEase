export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatCurrency(amount) {
  if (amount === 0 || amount === '0' || !amount) {
    return 'Free';
  }
  return `$${Number(amount).toFixed(2)}`;
}

export function isDeadlinePassed(deadlineString) {
  if (!deadlineString) return false;
  return new Date(deadlineString) < new Date();
}

export function getDaysUntil(dateString) {
  if (!dateString) return 0;
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
