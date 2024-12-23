import { beforeEach, describe, it } from "@std/testing/bdd"
import { StatementCache } from "./statementcache.ts"
import { expect } from "@std/expect/expect"

const TEST_SQL = "select * from users"

class MockConnection {
  prepare(_sql: string): MockStatement {
    return new MockStatement()
  }
}

class MockStatement { }

describe("StatementCache", () => {
  let cache: StatementCache<MockConnection, MockStatement>;
  const conn = new MockConnection()

  beforeEach(() => {
    cache = new StatementCache()
  })

  describe("when a statement is not in the cache", () => {
    it("caches the compiled statement and returns it", () => {
      const stmt = cache.prepareAndCache(conn, TEST_SQL)

      expect(stmt).toBeInstanceOf(MockStatement)
    })
  })

  describe("when a statement is in the cache", () => {
    it("returns the cached statement", () => {
      const stmt = cache.prepareAndCache(conn, TEST_SQL)
      const stmt2 = cache.prepareAndCache(conn, TEST_SQL)

      expect(stmt).toBe(stmt2)
    })
  })
})
