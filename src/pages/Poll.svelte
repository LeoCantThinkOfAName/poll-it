<script lang="ts">
  import { writable } from "svelte/store";
  import { flip } from "svelte/animate";
  import { database } from "../firebase.ts";
  export let pollId;
  // create local poll store
  const poll = writable();

  // this will kepp listening firebase database(?)
  database
    .collection("polls")
    .doc(pollId)
    .onSnapshot(doc => {
      const data = doc.data();
      poll.set(data);
    });

  const handleInput = (e: Event) => {
    const newNum = parseInt(e.target.value);
    console.log(newNum);
    calculatePercentage();
  };

  const calcPercentage = (votes: number) => {
    const total = $poll.options.reduce((acc, val) => {
      if (typeof acc === "number") {
        return acc + val.votes;
      } else {
        return acc.votes + val.votes;
      }
    });
    return (votes / total) * 100;
  };

  const vote = (optionId: number) => {
    // update record
    const increment = firebase.firestore.FieldValue.increment(1);
    const newOptions = [...$poll.options];
    database
      .collection("polls")
      .doc(pollId)
      .update({
        options: newOptions[optionId] = {
          id: optionId,
          title: $poll.options[optionId].title,
          votes: increment
        }
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
  <h2 class="text-xl font-bold mb-3">
    {#if $poll !== undefined}{$poll.title}{/if}
  </h2>
  <form
    id="vote"
    on:submit={handleSubmit}
    class="max-w-full w-full sm:max-w-lg flex justify-center items-center
    flex-col">
    <div class="w-full border border-gray-400 px-3 py-1 mb-1">
      {#if $poll !== undefined}
        {#each $poll.options.sort((a, b) => b.votes - a.votes) as option, index (option.id)}
          <div
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
