import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  githubProvider,
  googleProvider,
  hasFirebaseConfig,
  twitterProvider,
} from "../firebase";

const providerButtons = [
  {
    label: "Google",
    provider: googleProvider,
    className: "bg-white text-slate-950 hover:bg-slate-200",
  },
  {
    label: "GitHub",
    provider: githubProvider,
    className: "bg-slate-950 text-white hover:bg-slate-800",
  },
  {
    label: "Twitter",
    provider: twitterProvider,
    className: "bg-sky-500 text-white hover:bg-sky-600",
  },
];

const getAuthMessage = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is not correct.";
    case "auth/email-already-in-use":
      return "That email already has an account. Sign in instead.";
    case "auth/weak-password":
      return "Use at least 6 characters for your password.";
    case "auth/popup-closed-by-user":
      return "The sign-in window was closed before finishing.";
    case "auth/account-exists-with-different-credential":
      return "This email is already connected to another sign-in method.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication.";
    case "auth/unauthorized-domain":
      return "This website domain is not authorized in Firebase Authentication.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups and try again.";
    default:
      return "Authentication failed. Check your details and try again.";
  }
};

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegistering = mode === "register";

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(getAuthMessage(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(getAuthMessage(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasFirebaseConfig) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-lg items-center p-4">
        <section className="w-full rounded-lg border border-red-400/40 bg-red-950/30 p-5 text-left">
          <h1 className="mb-3 text-2xl font-bold text-white">
            Firebase setup needed
          </h1>
          <p className="text-sm text-red-100">
            Add your Firebase web app values to a local <code>.env</code> file
            before users can sign in.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg items-center p-4">
      <section className="w-full rounded-lg border border-slate-700 bg-slate-950 p-5 text-left shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
            Secure voting
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Sign in before you vote
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Use email and password, or continue with your social account.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError("");
            }}
            className={`rounded-md py-2 text-sm font-semibold transition ${
              !isRegistering
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`rounded-md py-2 text-sm font-semibold transition ${
              isRegistering
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="At least 6 characters"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-500 py-3 font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-wait disabled:bg-slate-600 disabled:text-slate-300"
          >
            {isSubmitting
              ? "Checking credentials..."
              : isRegistering
              ? "Create account"
              : "Sign in to vote"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span className="h-px flex-1 bg-slate-800" />
          or
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {providerButtons.map((button) => (
            <button
              key={button.label}
              type="button"
              onClick={() => handleSocialAuth(button.provider)}
              disabled={isSubmitting}
              className={`rounded-lg px-3 py-3 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${button.className}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AuthPage;