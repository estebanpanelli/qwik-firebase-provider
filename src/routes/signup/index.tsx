import { $, component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { UserContext, signUp } from "~/stores/user-store";
import styles from "./styles.module.css";

export default component$(() => {
  const UserStore = useContext(UserContext);
  const nav = useNavigate();

  const userName = useSignal("");
  const password = useSignal("");
  const password2 = useSignal("");
  const displayName = useSignal("");

  const loading = useSignal(false);

  const loginUser = $(() => {
    let isFormValid = true;

    if (userName.value.length === 0) isFormValid = false;
    if (password.value.length === 0) isFormValid = false;
    if (password.value !== password2.value) isFormValid = false;
    if (!displayName.value) isFormValid = false;

    if (!isFormValid) {
      alert("Check for all fields");
      return;
    }

    loading.value = true;

    signUp(UserStore, userName.value, password.value, displayName.value)
      .then(() => nav("/"))
      .catch(console.error);
  });

  useVisibleTask$(({ track }) => {
    track(() => UserStore.user);
    if (UserStore.authReady && UserStore.user != null) nav("/");
  });

  return (
    <div class={styles["login-page"]}>
      <h1>Sign Up</h1>
      <form onSubmit$={loginUser} preventdefault:submit>
        <label for="username">Email</label>
        <input type="text" id="username" bind:value={userName} name="username" />
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} name="password" />
        <label for="password">Repeat password</label>
        <input type="password" id="password" bind:value={password2} name="password2" />
        <label for="displayName">Display name</label>
        <input type="text" id="displayName" bind:value={displayName} name="displayName" />
        <input type="submit" value="Submit" disabled={loading.value} />
        <Link href="/signin">Already have account?</Link>
      </form>
    </div>
  );
});
