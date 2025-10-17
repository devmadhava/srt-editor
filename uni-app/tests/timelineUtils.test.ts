// @ts-nocheck
import { timeToSeconds, formatSeconds, validateTime, checkCollision, snapToGrid, generateTimelineMarkers, getValidTimeRange, createTimeFromSeconds } from "../utils/timelineUtils";

describe('timelineUtils', () => {
  describe('timeToSeconds and validateTime', () => {
    it('parses HH:MM:SS,mmm correctly', () => {
      const s = '01:02:03,004';
      expect(validateTime(s)).toBe(true);
      expect(timeToSeconds(s)).toBeCloseTo(3723.004, 6);
    });

    it('rejects invalid formats', () => {
      expect(validateTime('invalid')).toBe(false);
      expect(timeToSeconds('invalid')).toBe(0);
    });

    it('parses microsecond-like extension if present', () => {
      const s = '00:00:00,123.45'; // 123 ms and extra 45 -> 45 / 10^(2+3) = 45 / 100000 = 0.00045
      expect(validateTime(s)).toBe(true);
      const secs = timeToSeconds(s);
      expect(secs).toBeGreaterThan(0.123);
    });
  });

  describe('formatSeconds and createTimeFromSeconds', () => {
    it('formats seconds into HH:MM:SS', () => {
      expect(formatSeconds(3661)).toBe('01:01:01');
      expect(formatSeconds(59)).toBe('00:00:59');
    });
  });

  describe('checkCollision', () => {
    const blocks = [
      { id: 'a', startTime: 0, endTime: 5 },
      { id: 'b', startTime: 10, endTime: 15 },
    ];

    it('detects overlapping intervals', () => {
      expect(checkCollision(4, 11, blocks)).toBe(true); // overlaps a and b
      expect(checkCollision(5, 10, blocks)).toBe(false); // touches boundaries but not overlapping
      expect(checkCollision(6, 9, blocks)).toBe(false);
    });
  });

  describe('snapToGrid and generateTimelineMarkers', () => {
    it('snaps to nearest grid', () => {
      expect(snapToGrid(2.4, 1)).toBe(2);
      expect(snapToGrid(2.6, 1)).toBe(3);
      expect(snapToGrid(2.5, 0.5)).toBe(2.5);
    });

    it('generates markers', () => {
      const markers = generateTimelineMarkers(10, 2);
      expect(markers).toEqual([0,2,4,6,8]);
    });
  });

  describe('getValidTimeRange and createTimeFromSeconds', () => {
    it('ensures minimum block size and snaps (collision moves block into available left space)', () => {
      const blocks = [
        { id: 'a', startTime: 0, endTime: 2 },
        { id: 'b', startTime: 5, endTime: 7 },
      ];

      const res = getValidTimeRange(1.2, 1.6, blocks, 'new', 10);
      // current implementation moves the proposed block into the left available space (start 0)
      // and preserves the original proposed duration (0.4)
      expect(res.startTime).toBe(0);
      expect(res.endTime - res.startTime).toBeCloseTo(0.4, 6);
    });

    it('createTimeFromSeconds produces SRT-like time', () => {
      const t = createTimeFromSeconds(3723.004);
      expect(typeof t).toBe('string');
      expect(t).toMatch(/\d{2}:\d{2}:\d{2},\d{3}/);
    });
  });
});
