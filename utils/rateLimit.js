const rateLimit = new Map();

/**
 * Simple in-memory rate limiter
 * @param {string} identifier - IP or user ID
 * @param {number} limit - max requests
 * @param {number} windowMs - time window in ms
 * @returns {{ success: boolean, remaining: number }}
 */
export function checkRateLimit(identifier, limit = 10, windowMs = 60 * 1000) {
  const now = Date.now();
  const key = identifier;

  if (!rateLimit.has(key)) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  const data = rateLimit.get(key);

  if (now > data.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (data.count >= limit) {
    return { success: false, remaining: 0 };
  }

  data.count += 1;
  return { success: true, remaining: limit - data.count };
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimit.entries()) {
      if (now > val.resetAt) rateLimit.delete(key);
    }
  }, 5 * 60 * 1000);
}
