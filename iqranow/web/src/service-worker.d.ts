declare class ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void
}
