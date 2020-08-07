<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { database } from "../firebase.ts";
  import { pollTitle, pollOptions } from "../Store.ts";
  import { navigate } from "svelte-routing";

  const options = [
    { text: "Two Options", value: 2 },
    { text: "Three Options", value: 3 },
    { text: "Four Options", value: 4 },
    { text: "Five Options", value: 5 },
    { text: "Six Options", value: 6 }
  ];

  const handleInput = (e: Event) => {
    pollTitle.set(e.target.value);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // filter out empty option
    const options = Object.values($pollOptions).filter(
      option => option.title !== ""
    );

    // check if title is more than 3 chars
    if ($pollTitle.length <= 3) return;
    // check if options are more than two
    if (options.length < 2) return;

    const optionsObj = {};
    options.forEach((option, index) => {
      optionsObj[index] = option;
    });

    // create new poll record
    database
      .collection("polls")
      .add({
        title: $pollTitle,
        options: optionsObj,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        // success, redirect user to poll page
        console.log(`Poll created! ID: ${docRef.id}`);
        navigate(`/poll/${docRef.id}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleOptionInput = (e: Event, index: number) => {
    const value = e.target.value;
    const length = Object.keys($pollOptions).length;
    // if last options is filled, create a new input,
    if (index + 1 === length && value !== "" && length < 6) {
      pollOptions.set({
        ...$pollOptions,
        [index + 1]: { title: "", votes: 0 }
      });
    } else if (index + 2 === length && value === "" && length > 2) {
      const newObj = { ...$pollOptions };
      delete newObj[index + 1];
      pollOptions.set({ ...newObj });
    }
  };
</script>

<div class="flex h-full w-full sm:max-w-lg m-auto">
  <form
    class="flex flex-col items-center justify-center w-full"
    on:submit={handleSubmit}>
    <h2 class="text-xl font-bold text-center mb-3">
      Create A
      <span class="text-teal-500">Realtime</span>
      Poll With Ease!
    </h2>
    <div class="w-full my-2">
      <label for="pollTitle" class="text-xs mb-1 font-bold">
        Topic (Required, must longer than 3 characters)
      </label>
      <input
        id="pollTitle"
        type="text"
        placeholder="Start a poll topic"
        class="w-full p-2 outline-none border-gray-400 rounded-none"
        on:input={handleInput}
        required />
    </div>

    <p class="text-xs mb-1 self-start font-bold">
      Options (You can have up to 6 options, and no least than 2 options)
    </p>
    <fieldset class="border-gray-400 border p-2 w-full mb-3 transition-all">
      {#each Object.keys($pollOptions) as optionKey, index}
        <div in:fly={{ y: 25, duration: 500 }} out:fade class="w-full my-2">
          <label
            for={`option-${index}`}
            class="text-xs mb-1 text-gray-500 font-bold">
            Option {index + 1}
          </label>
          <input
            id={`option-${index}`}
            class="w-full p-2 outline-none border-gray-400 rounded-none"
            type="text"
            placeholder="Filled in your option"
            bind:value={$pollOptions[optionKey].title}
            on:input={e => handleOptionInput(e, index)} />
        </div>
      {/each}
    </fieldset>
    <button
      class="bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-500
      disabled:text-gray-300 py-2 px-4 border-none rounded-none button"
      disabled={$pollTitle.length < 3 || $pollOptions[0] === '' || $pollOptions[1] === ''}>
      Start A Poll
    </button>
  </form>
</div>
