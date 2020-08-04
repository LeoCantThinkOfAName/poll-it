<script lang="ts">
  import { pollTitle } from "../Store.ts";

  const handleInput = (e: Event) => {
    pollTitle.set(e.target.value);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log($pollTitle);
  };
</script>

<div class="flex flex-1 h-full justify-center items-center">
  <form
    class="flex flex-col w-full items-center justify-center"
    on:submit={handleSubmit}>
    <input
      type="text"
      placeholder="Start a poll topic"
      class="max-w-full w-full sm:max-w-md p-2 my-2 outline-none"
      on:input={handleInput} />
    <button
      class="bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-500
      disabled:text-gray-300 py-2 px-4 border-none button"
      disabled={$pollTitle.length < 3}>
      Start A Poll
    </button>
  </form>
</div>
