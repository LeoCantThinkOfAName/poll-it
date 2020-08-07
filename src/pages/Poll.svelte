<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { flip } from "svelte/animate";
  import { crossfade } from "svelte/transition";
  import { database } from "../firebase.ts";
  export let pollId;
  // create local poll store
  const title = writable("");
  const options = writable(undefined);
  const originalPolls = writable(undefined);
  const total = writable(0);

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200)
  });

  // this will kepp listening firebase database(?)
  const unsubscribe = database
    .collection("polls")
    .doc(pollId)
    .onSnapshot(doc => {
      const data = doc.data();
      const optionsArr = Object.values(data.options).map((option, index) => {
        return {
          id: index,
          ...option
        };
      });
      title.set(data.title);
      options.set(optionsArr);
      total.set(calcTotalVotes());
      originalPolls.set(data.options);
      console.log("votes updated!");
    });

  onMount(() => {
    console.log("Start listenging on snapshots events...");
  });

  onDestroy(() => {
    // kill onSnapshot listener
    unsubscribe();
    console.log("unmount, stop listening on snapshot events...");
  });

  const handleInput = (e: Event) => {
    const newNum = parseInt(e.target.value);
    console.log(newNum);
    calculatePercentage();
  };

  const calcTotalVotes = () => {
    const total = $options.reduce((acc, val) => {
      if (typeof acc === "number") {
        return acc + val.votes;
      } else {
        return acc.votes + val.votes;
      }
    });
    return total;
  };

  const calcPercentage = (votes: number) => {
    return (votes / $total) * 100;
  };

  const vote = (optionId: number) => {
    // update record
    const increment = firebase.firestore.FieldValue.increment(1);
    const target = `options.${optionId}.votes`;
    database
      .collection("polls")
      .doc(pollId)
      .update({
        [target]: increment
      });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // get user's choice
    const form = document.getElementById("vote");
    const formData = new FormData(form);
    const optionId = parseInt(formData.get("options"));

    // implement captcha
    grecaptcha.ready(() => {
      grecaptcha
        .execute("6LeEHbsZAAAAANEps4PUaqoekPHdGy66lcT13tGH", {
          action: "submit"
        })
        .then(token => vote(optionId));
    });
  };
</script>

<style>
  .percentage {
    width: 100%;
    left: -100%;
  }
</style>

<div class="flex flex-1 h-full justify-center items-center flex-col">
  <h2 class="text-2xl font-bold">{$title}</h2>
  <p class="mb-3 text-sm text-gray-500">Total participants: {$total}</p>
  <form
    id="vote"
    on:submit={handleSubmit}
    class="max-w-full w-full sm:max-w-lg flex justify-center items-center
    flex-col">
    <div class="w-full border border-gray-400 px-3 py-1 mb-1">
      {#if $options !== undefined}
        {#each $options.sort((a, b) => b.votes - a.votes) as option, index (option.id)}
          <div
            in:receive={{ key: option.id }}
            out:send={{ key: option.id }}
            animate:flip
            class="bg-gray-200 my-2 flex items-center relative overflow-hidden">
            <div
              class="percentage absolute h-full transition-transform
              duration-1000 ease-in-out {index === 0 ? 'bg-green-500' : 'bg-red-300'}"
              style="transform: translateX({calcPercentage(option.votes)}%);" />
            <input
              type="radio"
              name="options"
              id="option-{option.id}"
              value={option.id}
              class="relative ml-2" />
            <label
              class="p-2 font-bold relative block"
              for="option-{option.id}">
              {option.title} ({option.votes})
            </label>
          </div>
        {/each}
      {/if}
    </div>
    <p class="text-xs text-gray-500 mb-3">
      This site is protected by reCAPTCHA and the Google
      <a class="text-blue-500" href="https://policies.google.com/privacy">
        Privacy Policy
      </a>
      and
      <a class="text-blue-500" href="https://policies.google.com/terms">
        Terms of Service
      </a>
      apply.
    </p>
    <button
      class="bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-500
      disabled:text-gray-300 py-2 px-4 border-none rounded-none button
      outline-none">
      Vote!
    </button>
  </form>
</div>
