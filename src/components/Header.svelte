<script>
  import { link } from "svelte-routing";

  const login = () => {
    window.alert("Jinx! I'm not gonna do this!");
  };
</script>

<nav
  class="flex items-center justify-between flex-wrap bg-teal-500 p-3 sm:p-6
  text-white">
  <h1 class="flex items-center flex-shrink-0 mr-6 text-xl sm:text-2xl">
    <a use:link href="/" class="text-white visited:text-white">POLL-IT</a>
  </h1>
  <div class="w-full flex-grow flex justify-end flex-1">
    <a href="javascript:;" on:click={login}>Login</a>
  </div>
</nav>
