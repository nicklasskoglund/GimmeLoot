from __future__ import annotations

import time
import logging

logger = logging.getLogger('gamerpower.rate_limiter')


class RateLimiter:
    '''Simple token bucket rate limiter.'''
    def __init__(self, max_calls: int, period: float):
        self.max_calls = max_calls
        self.period = period    # seconds
        self._calls: list[float] = []
        
    def is_allowed(self) -> bool:
        now = time.monotonic()
        self._calls = [t for t in self._calls if now - t < self.period]
        if len(self._calls) < self.max_calls:
            self._calls.append(now)
            logger.debug('Rate limiter: %d/%d calls in window', len(self._calls), self.max_calls)
            return True
        logger.warning('Rate limit exceeded: %d calls in %.1fs', len(self._calls), self.period)
        return False
    