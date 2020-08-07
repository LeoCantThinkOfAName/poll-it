import { writable } from "svelte/store";

export const pollTitle = writable("");
export const pollOptions = writable({
  0: { title: "", votes: 0 },
  1: { title: "", votes: 0 },
});
