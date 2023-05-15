import { $, component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { UserContext, signIn } from "~/stores/user-store";
import styles from "./styles.module.css";

export default component$(() => {
  const UserStore = useContext(UserContext);
  const nav = useNavigate();

  const userName = useSignal("");
  const password = useSignal("");

  const loading = useSignal(false);

  const loginUser = $(() => {
    if (userName.value.length === 0) return;
    if (password.value.length === 0) return;

    loading.value = true;

    signIn(userName.value, password.value)
      .then(() => nav("/"))
      .catch(console.error);
  });

  useVisibleTask$(({ track }) => {
    track(() => UserStore.user);
    if (UserStore.authReady && UserStore.user != null) nav("/");
  });

  return (
    <div class={styles["login-page"]}>
      <h1>Sign In</h1>
      <form onSubmit$={loginUser} preventdefault:submit>
        <label for="username">Email</label>
        <input type="text" id="username" bind:value={userName} name="username" />
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} name="password" />
        <div class={styles["remember-me"]}>
          <input type="checkbox" id="remember" name="remember" />
          <label for="remember">Remember me</label>
        </div>

        <input type="submit" value="Submit" disabled={loading.value} />
        <Link href="/signup">Create an account</Link>
      </form>
    </div>
  );
});
