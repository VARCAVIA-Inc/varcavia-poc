/* eslint-disable
  @typescript-eslint/no-empty-object-type,
  @typescript-eslint/no-unused-vars
*/

// Tipi globali SvelteKit (estendili al bisogno)
import type { Session } from "@sveltejs/kit";

declare global {
  namespace App {
    interface Locals {}
    interface PageData {}
    interface Platform {}
  }
}

export {};
