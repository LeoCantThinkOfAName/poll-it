<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Tailwindcss from "./Tailwindcss.svelte";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Index from "./pages/Index.svelte";
  import Poll from "./pages/Poll.svelte";

  export let url = "";
</script>

<style type="scss">
  :global(html, body) {
    padding: 0;
  }

  :global(body) {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  :global(.grecaptcha-badge) {
    visibility: hidden;
  }
</style>

<Tailwindcss />
<Router {url}>
  <Header />
  <main class="px-3 py-3 sm:px-6 flex-1 text-gray-700">
    <Route path="/poll/:pollId" component={Poll} />
    <Route path="/" component={Index} />
  </main>
  <Footer />
</Router>
