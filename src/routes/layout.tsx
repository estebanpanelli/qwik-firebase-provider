import { component$, Slot, useContext, useSignal } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <header class="header-container">
        <h1>Firebase Auth provider for Qwik</h1>
      </header>
      <main>
        <Slot />
      </main>
    </>
  );
});
