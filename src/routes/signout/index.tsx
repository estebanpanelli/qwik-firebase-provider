import { component$, useContext, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { singOut } from "~/stores/user-store";
import { UserContext } from "~/stores/user-store";

export default component$(() => {
  const nav = useNavigate();

  const UserStore = useContext(UserContext);

  useVisibleTask$(({ track }) => {
    track(() => UserStore.authReady);
    if (UserStore.user !== null) {
      UserStore.user = null;
      UserStore.uid = null;
      singOut()
        .then(() => nav("/signin"))
        .catch(console.error);
    }
  });

  return (
    <>
      <p>Please wait while redirected.</p>
    </>
  );
});
