import { writable } from "svelte/store";

export const pollTitle = writable("");
export const pollOptions = writable([
  { id: 0, title: "", votes: 0 },
  { id: 1, title: "", votes: 0 },
]);
