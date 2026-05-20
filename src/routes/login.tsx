import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar — Saber Aberto" },
      { name: "description", content: "Acesse sua conta Saber Aberto." },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-ink text-cream">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="inline-block w-6 h-6 bg-primary rounded-sm rotate-45" />
          Saber Aberto
        </Link>
        <div>
          <p className="font-display text-4xl leading-tight font-light max-w-md">
            "A educação é a arma mais poderosa que você pode usar para mudar o mundo."
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-cream/60">— Nelson Mandela</p>
        </div>
        <div className="text-xs text-cream/40">ODS 4 · Educação de Qualidade</div>
      </aside>
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-10 font-display text-xl font-semibold">
            <span className="inline-block w-6 h-6 bg-primary rounded-sm rotate-45" />
            Saber Aberto
          </Link>
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Entrar</div>
          <h1 className="font-display text-4xl font-light leading-tight mb-2">Bem-vindo de volta.</h1>
          <p className="text-muted-foreground mb-8 text-sm">Continue sua trilha de aprendizagem.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">E-mail</label>
              <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none rounded-md transition" />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Senha</label>
              <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none rounded-md transition" />
            </div>
            {error && <p className="text-sm text-primary">{error}</p>}
            <button type="submit" disabled={loading} className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">Cadastre-se</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
