declare module "yjs" {
  export class Doc {}
}

declare module "y-webrtc" {
  export class WebrtcProvider {
    constructor(roomName: string, doc: any, opts?: any)
    destroy(): void
  }
}

declare module "y-protocols/awareness" {
  export interface Awareness {}
}
