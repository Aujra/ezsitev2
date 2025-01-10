export function generateId(): string {
  // Simple timestamp + random number based ID
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
