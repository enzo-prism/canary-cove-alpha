import { describe, expect, test } from "vitest"

import { formatVideoTime } from "@/lib/video-time"

describe("formatVideoTime", () => {
  test("formats seconds as m:ss", () => {
    expect(formatVideoTime(0)).toBe("0:00")
    expect(formatVideoTime(5.9)).toBe("0:05")
    expect(formatVideoTime(62)).toBe("1:02")
    expect(formatVideoTime(3599)).toBe("59:59")
  })

  test("adds hours past one hour", () => {
    expect(formatVideoTime(3600)).toBe("1:00:00")
    expect(formatVideoTime(3723)).toBe("1:02:03")
  })

  test("guards invalid input", () => {
    expect(formatVideoTime(Number.NaN)).toBe("0:00")
    expect(formatVideoTime(Number.POSITIVE_INFINITY)).toBe("0:00")
    expect(formatVideoTime(-3)).toBe("0:00")
  })
})
