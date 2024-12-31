type Constructor<T> = new (...args: any[]) => T
type ConstructorFn<T> = (c: IoCContainer) => T

class Provider<T> {
  fn: ConstructorFn<T>

  constructor(fn: ConstructorFn<T>) {
    this.fn = fn
  }
}

class SingletonProvider<T> extends Provider<T> {
  cachedValue?: T
}

class IoCContainer {
  private readonly _typedProviders: Map<Constructor<any>, Provider<any>>
  private readonly _namedProviders: Map<
    string,
    Provider<any>
  >

  constructor() {
    this._typedProviders = new Map()
    this._namedProviders = new Map()
  }

  private typeTupleToString<T>(
    type: Constructor<T>,
    providerName: string,
  ): string {
    return `${type.name}_${providerName}`
  }

  instance<T>(
    type: Constructor<T>,
    fn: ConstructorFn<T>,
  ): IoCContainer {
    if (this._typedProviders.has(type)) {
      throw new Error(`Type '${type.toString()}' was already registered`)
    }

    this._typedProviders.set(type, new Provider(fn))

    return this
  }

  singleton<T>(
    type: Constructor<T>,
    fn: ConstructorFn<T>,
  ): IoCContainer {
    if (this._typedProviders.has(type)) {
      throw new Error(`Type '${type.name}' was already registered`)
    }

    this._typedProviders.set(type, new SingletonProvider(fn))

    type.name

    return this
  }

  instanceWithProvider<T>(
    type: Constructor<T>,
    providerName: string,
    fn: ConstructorFn<T>,
  ): IoCContainer {
    const tuple = this.typeTupleToString(type, providerName)

    if (this._namedProviders.has(tuple)) {
      throw new Error(
        `Type' ${type.name}' already has a provider with name '${providerName}'`,
      )
    }

    this._namedProviders.set(tuple, new Provider(fn))

    return this
  }

  singletonWithProvider<T>(
    type: Constructor<T>,
    providerName: string,
    fn: ConstructorFn<T>,
  ): IoCContainer {
    const tuple = this.typeTupleToString(type, providerName)

    if (this._namedProviders.has(tuple)) {
      throw new Error(
        `Type '${type.name}' already has a provider with name '${providerName}'`,
      )
    }

    this._namedProviders.set(tuple, new SingletonProvider(fn))

    return this
  }

  get<T>(type: Constructor<T>): T
  get<T>(type: Constructor<T>, providerName: string): T
  get<T>(type: Constructor<T>, providerName?: string): T {
    let metadata: Provider<T> | SingletonProvider<T>

    if (!providerName) {
      if (!this._typedProviders.has(type)) {
        throw new Error(`Type '${type.name}' has no provider`)
      }

      metadata = this._typedProviders.get(type)!
    } else {
      const tuple = this.typeTupleToString(type, providerName)

      if (!this._namedProviders.has(tuple)) {
        throw new Error(
          `Type '${type.name}' has no named provider '${providerName}'`,
        )
      }

      metadata = this._namedProviders.get(tuple)!
    }

    if (metadata instanceof SingletonProvider) {
      const singletonMetadata = metadata as SingletonProvider<T>

      singletonMetadata.cachedValue ??= singletonMetadata.fn(this)

      return singletonMetadata.cachedValue
    }

    return metadata.fn(this)
  }

  hasProvider<T>(type: Constructor<T>): boolean
  hasProvider<T>(type: Constructor<T>, providerName: string): boolean
  hasProvider<T>(type: Constructor<T>, providerName?: string): boolean {
    return providerName
      ? this._namedProviders.has(this.typeTupleToString(type, providerName))
      : this._typedProviders.has(type)
  }

  reset() {
    this._namedProviders.clear()
    this._typedProviders.clear()
  }
}

export { IoCContainer }
