import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { UserContext } from "~/stores/user-store";
import { Link, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const UserStore = useContext(UserContext);
  const nav = useNavigate();

  useVisibleTask$(({ track }) => {
    track(() => UserStore.authReady);
    if (UserStore.authReady && UserStore.user === null) {
      nav("/login");
    }
  });

  const newName = useSignal("");

  return (
    <>
      <div class="main-card">Hi {UserStore?.user?.displayName}!</div>
      <div class="main-card">
        <input type="text" bind:value={newName} />
        <button onClick$={() => UserStore.setDisplayName(newName.value)}>Change name</button>
      </div>
      <div class="main-card">
        <Link href="/signout">Logout</Link>
      </div>
    </>
  );
});
