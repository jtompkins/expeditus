import { beforeEach, describe, it } from "@std/testing/bdd"
import { expect, fn } from "@std/expect"
import { IoCContainer } from "./ioc-container.ts"

type ConstructorSpy<T> = (c: IoCContainer) => T

class TestDependency {
  constructor() {}
}

describe("DIContainer", () => {
  let container: IoCContainer

  beforeEach(() => {
    container = new IoCContainer()
  })

  describe("registering type providers", () => {
    describe("#instance", () => {
      it("returns the container instance", () => {
        const c = container.instance(TestDependency, () => new TestDependency())

        expect(c).toBe(container)
      })

      it("registers as the default provider for that type", () => {
        container.instance(TestDependency, () => new TestDependency())

        expect(container.hasProvider(TestDependency)).toBeTruthy()
      })

      describe("if #instance is called for the same type multiple times", () => {
        it("throws an error", () => {
          container.instance(TestDependency, () => new TestDependency())

          expect(() => {
            container.instance(TestDependency, () => new TestDependency())
          }).toThrow()
        })
      })
    })

    describe("#instanceWithProvider", () => {
      it("returns the container instance", () => {
        const c = container.instanceWithProvider(
          TestDependency,
          "test",
          () => new TestDependency(),
        )

        expect(c).toBe(container)
      })

      it("registers the provider for the given type under the given name", () => {
        container.instanceWithProvider(
          TestDependency,
          "test",
          () => new TestDependency(),
        )

        expect(container.hasProvider(TestDependency, "test")).toBeTruthy()
      })

      describe("if #instance is called for the same type and name multiple times", () => {
        it("throws an error", () => {
          container.instanceWithProvider(
            TestDependency,
            "test",
            () => new TestDependency(),
          )

          expect(() => {
            container.instanceWithProvider(
              TestDependency,
              "test",
              () => new TestDependency(),
            )
          }).toThrow()
        })
      })
    })

    describe("#singleton", () => {
      it("returns the container instance", () => {
        const c = container.singleton(
          TestDependency,
          () => new TestDependency(),
        )

        expect(c).toBe(container)
      })

      it("registers as the default provider for that type", () => {
        container.singleton(TestDependency, () => new TestDependency())

        expect(container.hasProvider(TestDependency)).toBeTruthy()
      })

      describe("if #instance is called for the same type multiple times", () => {
        it("throws an error", () => {
          container.singleton(TestDependency, () => new TestDependency())

          expect(() => {
            container.singleton(TestDependency, () => new TestDependency())
          }).toThrow()
        })
      })
    })

    describe("#singletonWithProvider", () => {
      it("returns the container instance", () => {
        const c = container.singletonWithProvider(
          TestDependency,
          "test",
          () => new TestDependency(),
        )

        expect(c).toBe(container)
      })

      it("registers the provider for the given type under the given name", () => {
        container.singletonWithProvider(
          TestDependency,
          "test",
          () => new TestDependency(),
        )

        expect(container.hasProvider(TestDependency, "test")).toBeTruthy()
      })

      describe("if #instance is called for the same type and name multiple times", () => {
        it("throws an error", () => {
          container.singletonWithProvider(
            TestDependency,
            "test",
            () => new TestDependency(),
          )

          expect(() => {
            container.singletonWithProvider(
              TestDependency,
              "test",
              () => new TestDependency(),
            )
          }).toThrow()
        })
      })
    })
  })

  describe("providing values", () => {
    describe("when a typed provider is requested but not registered", () => {
      it("throws an error", () => {
        expect(() => container.get(TestDependency)).toThrow()
      })
    })

    describe("when a named provider is requested but not registered", () => {
      it("throws an error", () => {
        expect(() => container.get(TestDependency, "test")).toThrow()
      })
    })

    describe("getting an instance", () => {
      let instanceSpy: ConstructorSpy<TestDependency>

      beforeEach(() => {
        instanceSpy = fn(() => new TestDependency()) as ConstructorSpy<
          TestDependency
        >

        container.instance(TestDependency, instanceSpy)
      })

      it("returns an instance of the type", () => {
        expect(container.get(TestDependency)).toBeInstanceOf(TestDependency)
        expect(instanceSpy).toBeCalled()
      })

      it("returns a new instance each time get is called", () => {
        expect(container.get(TestDependency)).not.toBe(
          container.get(TestDependency),
        )
      })

      it("calls the constructor function for each invocation", () => {
        container.get(TestDependency)
        container.get(TestDependency)

        expect(instanceSpy).toBeCalledTimes(2)
      })
    })

    describe("getting a singleton", () => {
      let singletonSpy: ConstructorSpy<TestDependency>

      beforeEach(() => {
        singletonSpy = fn(() => new TestDependency()) as ConstructorSpy<
          TestDependency
        >

        container.singleton(TestDependency, singletonSpy)
      })

      it("returns the same instance each time", () => {
        const s1 = container.get(TestDependency)
        const s2 = container.get(TestDependency)

        expect(s1).toBe(s2)
      })

      it("only calls the constructor function once", () => {
        container.get(TestDependency)
        container.get(TestDependency)

        expect(singletonSpy).toBeCalledTimes(1)
      })
    })

    describe("when the requested type has multiple named providers", () => {
      it("returns the correct value based on the name", () => {
        const leftSpy = fn(() => new TestDependency()) as ConstructorSpy<
          TestDependency
        >

        const rightSpy = fn(() => new TestDependency()) as ConstructorSpy<
          TestDependency
        >

        container.singletonWithProvider(TestDependency, "left", leftSpy)
        container.singletonWithProvider(TestDependency, "right", rightSpy)

        container.get(TestDependency, "left")

        expect(leftSpy).toHaveBeenCalled()
        expect(rightSpy).not.toHaveBeenCalled()

        container.get(TestDependency, "right")

        expect(rightSpy).toHaveBeenCalled()
      })
    })
  })

  describe("resetting the container", () => {
    it("removes all registered providers", () => {
      const container = new IoCContainer()

      container.instance(TestDependency, () => new TestDependency())

      expect(container.hasProvider(TestDependency)).toBeTruthy()

      container.reset()

      expect(container.hasProvider(TestDependency)).toBeFalsy()
    })
  })
})
