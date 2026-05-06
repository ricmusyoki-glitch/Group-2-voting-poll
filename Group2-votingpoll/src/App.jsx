import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPage from "./Component/AuthPage";
import PollForm from "./Component/PollForm";
import PollList from "./Component/PollList";
import { auth } from "./firebase";

const defaultOptions = [
  { id: 1, text: "Immanuel Okoth", votes: 0 },
  { id: 2, text: "Shadrack Mason", votes: 0 },
  { id: 3, text: "Joshua Mbilli", votes: 0 },
];

const readSavedOptions = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("pollOptions"));
    return Array.isArray(saved) && saved.length > 0 ? saved : defaultOptions;
  } catch {
    return defaultOptions;
  }
};

const getVotedKey = (userId) => `hasVoted:${userId}`;

const readHasVoted = (userId) => {
  if (!userId) return false;
  try {
    return JSON.parse(localStorage.getItem(getVotedKey(userId))) === true;
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children, user, isLoading }) => {
  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-4">
        <p className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-300">
          Checking your sign-in status...
        </p>
      </main>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};


const PublicRoute = ({ children, user, isLoading }) => {
  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-4">
        <p className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-300">
          Checking your sign-in status...
        </p>
      </main>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};


function PollApp({ user }) {
  const [options, setOptions] = useState(readSavedOptions);
  const [hasVoted, setHasVoted] = useState(() => readHasVoted(user?.uid));
  const [error, setError] = useState("");

  const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, " ");

  useEffect(() => {
    localStorage.setItem("pollOptions", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getVotedKey(user.uid), JSON.stringify(hasVoted));
    }
  }, [hasVoted, user]);

  const addOption = (text) => {
    const normalizedInput = normalize(text);
    if (!normalizedInput) {
      setError("Option cannot be empty");
      return;
    }
    const exists = options.some(
      (opt) => normalize(opt.text) === normalizedInput
    );
    if (exists) {
      setError("That option already exists");
      return;
    }
    const newOption = {
      id: Date.now(),
      text: text.trim(),
      votes: 0,
    };
    setOptions((prev) => [...prev, newOption]);
    setError("");
  };

  const handleVote = (id) => {
    if (!user || hasVoted) return;
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );
    setHasVoted(true);
  };

  const resetVotes = () => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, votes: 0 })));
    setHasVoted(false);
  };

  const resetOptions = () => {
    if (!window.confirm("Reset poll to default options?")) return;
    setOptions(defaultOptions);
    setHasVoted(false);
    localStorage.removeItem("pollOptions");
  };

  const clearOptions = () => {
    if (!window.confirm("Clear all options and start fresh?")) return;
    setOptions([]);
    setHasVoted(false);
    localStorage.removeItem("pollOptions");
  };

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <main className="mx-auto max-w-md space-y-6 p-4">
      <h1 className="text-center text-3xl text-white font-bold">Voting Poll App</h1>
      <section className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-left">
        <p className="text-sm text-slate-400">Signed in as</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-semibold text-white">
            {user.displayName || user.email || "Verified voter"}
          </p>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="shrink-0 rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </section>
      <PollForm addOption={addOption} error={error} />
      <PollList
        options={options}
        onVote={handleVote}
        hasVoted={hasVoted}
        totalVotes={totalVotes}
      />
      <div className="space-y-2">
        <button
          onClick={resetVotes}
          className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Reset Votes
        </button>
        <button
          onClick={resetOptions}
          className="w-full rounded-lg bg-yellow-500 py-2 text-white hover:bg-yellow-600"
        >
          Reset to Default Poll
        </button>
        <button
          onClick={clearOptions}
          className="w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
        >
          Start Fresh Poll
        </button>
      </div>
    </main>
  );
}


function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return undefined;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} isLoading={isAuthLoading}>
              <PollApp key={user?.uid} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicRoute user={user} isLoading={isAuthLoading}>
              <AuthPage />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;