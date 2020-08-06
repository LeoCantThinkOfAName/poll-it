<script lang="ts">
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
    // check if title is more than 3 chars
    if ($pollTitle.length <= 3) return;
    // check if options are more than two
    if (pollOptions[0] === "" || pollOptions[2] === "") return;

    // filter out empty option
    const options = $pollOptions.filter(option => option.title !== "");

    // create new poll record
    database
      .collection("polls")
      .add({
        title: $pollTitle,
        options,
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
    const length = $pollOptions.length;
    // if last options is filled, create a new input,
    if (index + 1 === length && length < 6 && value !== "") {
      pollOptions.set([
        ...$pollOptions,
        { id: index + 1, title: "", votes: 0 }
      ]);
    } else if (index < length) {
      return;
    } else {
      pollOptions.set();
    }
  };
</script>

<div class="flex h-full w-full sm:max-w-lg m-auto">
  <form
    class="flex flex-col items-center justify-center w-full"
    on:submit={handleSubmit}>
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
    <fieldset class="border-gray-400 border p-2 w-full mb-3">
      {#each $pollOptions as option, index}
        <div class="w-full my-2">
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
            bind:value={option.title}
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
