import { beforeEach, describe, it } from "@std/testing/bdd"
import { assertSpyCalls, Spy, spy } from "@std/testing/mock"
import { expect } from "@std/expect"
import { DbConnectionPool } from "./dbconnectionpool.ts"

class MockDatabase {}

describe("DbConnectionPool<TDriver>", () => {
  let connPool: DbConnectionPool<MockDatabase>
  let spyDbFunction: Spy<unknown, [], MockDatabase>

  beforeEach(() => {
    spyDbFunction = spy(() => new MockDatabase())
    connPool = new DbConnectionPool(4, spyDbFunction)
  })

  it("returns the maximum number of connections", () => {
    expect(connPool.max).toBe(4)
  })

  it("returns the number of currently open connections", () => {
    expect(connPool.opened).toBe(0)
  })

  it("returns the number of connections currently available to borrow", () => {
    expect(connPool.count).toBe(4)
  })

  describe("when borrowing a connection", () => {
    it("returns the right number of opened connections", () => {
      connPool.borrow()

      expect(connPool.opened).toBe(1)
    })

    it("returns the right number of available connections", () => {
      const conn1 = connPool.borrow()
      connPool.borrow()
      connPool.borrow()
      connPool.borrow()

      connPool.release(conn1)

      expect(connPool.count).toBe(1)
    })

    describe("when the pool is not full", () => {
      it("returns a new connection", () => {
        const conn = connPool.borrow()

        expect(conn).toBeInstanceOf(MockDatabase)
      })

      it("executes the connection constructor callback", () => {
        connPool.borrow()

        assertSpyCalls(spyDbFunction, 1)
      })
    })

    describe("when the pool is full", () => {
      beforeEach(() => {
        const conn = connPool.borrow()
        connPool.borrow()
        connPool.borrow()
        connPool.borrow()

        connPool.release(conn)
      })

      it("returns a connection from the pool", () => {
        const conn = connPool.borrow()

        expect(conn).toBeInstanceOf(MockDatabase)
      })

      it("does not call the connection constructor callback", () => {
        connPool.borrow()

        // there are 5 borrows in this test context, so the fn should have
        // been called 4 times but not the fifth time
        assertSpyCalls(spyDbFunction, 4)
      })
    })

    describe("when a connection is not available", () => {
      it("throws an error", () => {
        connPool.borrow()
        connPool.borrow()
        connPool.borrow()
        connPool.borrow()

        expect(() => connPool.borrow()).toThrow()
      })
    })
  })

  describe("when closing the pool", () => {
    it("closes all of the open connections", () => {
      const closeSpy = spy((_conn: MockDatabase) => {})
      const connPool = new DbConnectionPool(
        1,
        () => new MockDatabase(),
        closeSpy,
      )

      const conn = connPool.borrow()
      connPool.release(conn)

      connPool.close()

      assertSpyCalls(closeSpy, 1)
    })

    it("throws an error when borrowing from a closed pool", () => {
      const connPool = new DbConnectionPool(1, () => new MockDatabase())

      connPool.close()

      expect(() => connPool.borrow()).toThrow()
    })

    it("throws an error when releasing a connection to a closed pool", () => {
      const connPool = new DbConnectionPool(1, () => new MockDatabase())

      const conn = connPool.borrow()

      connPool.close()

      expect(() => connPool.release(conn)).toThrow()
    })
  })

  describe("when working with a connection", () => {
    it("caches prepared statements against the connection it is run on", () => {
    })

    it("returns the cached statement when given the same SQL", () => {
    })
  })
})
