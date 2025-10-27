/**
 * Dependency Injection Container
 * Simple IoC container for managing service instances
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type Constructor<T> = new (...args: any[]) => T
type Factory<T> = () => T
type ServiceIdentifier<T> = symbol | Constructor<T>

class Container {
  private services = new Map<ServiceIdentifier<any>, any>()
  private singletons = new Map<ServiceIdentifier<any>, any>()

  /**
   * Register a service with a factory function
   */
  register<T>(identifier: ServiceIdentifier<T>, factory: Factory<T>): void {
    this.services.set(identifier, factory)
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(identifier: ServiceIdentifier<T>, factory: Factory<T>): void {
    if (!this.singletons.has(identifier)) {
      this.singletons.set(identifier, factory())
    }
  }

  /**
   * Register a class constructor
   */
  registerClass<T>(identifier: ServiceIdentifier<T>, constructor: Constructor<T>): void {
    this.services.set(identifier, () => new constructor())
  }

  /**
   * Resolve a service instance
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    if (this.singletons.has(identifier)) {
      return this.singletons.get(identifier) as T
    }

    const factory = this.services.get(identifier)
    if (factory) {
      return factory() as T
    }

    throw new Error(`Service not found: ${String(identifier)}`)
  }

  /**
   * Check if a service is registered
   */
  has<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.services.has(identifier) || this.singletons.has(identifier)
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.services.clear()
    this.singletons.clear()
  }
}

/**
 * Global container instance
 */
export const container = new Container()

/**
 * Helper function to resolve services
 */
export const inject = <T>(identifier: ServiceIdentifier<T>): T => {
  return container.resolve(identifier)
}
