import type { Session } from "@sveltejs/kit";

declare global {
  namespace App {
    interface Locals {}
    interface PageData {}
    interface Platform {}
  }
}

export {};
