import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Cadastro — Saber Aberto" },
      { name: "description", content: "Crie sua conta Saber Aberto e comece a aprender." },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message.includes("already") ? "Este e-mail já está cadastrado." : error.message);
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="inline-block w-6 h-6 bg-cream rounded-sm rotate-45" />
          Saber Aberto
        </Link>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-80 mb-4">Você é bem-vindo</div>
          <p className="font-display text-5xl leading-tight font-light max-w-md">
            Aprender é um <em className="italic">direito</em>, não um privilégio.
          </p>
        </div>
        <div className="text-xs opacity-70">ODS 4 · Educação de Qualidade</div>
      </aside>
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-10 font-display text-xl font-semibold">
            <span className="inline-block w-6 h-6 bg-primary rounded-sm rotate-45" />
            Saber Aberto
          </Link>
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Cadastro</div>
          <h1 className="font-display text-4xl font-light leading-tight mb-2">Comece sua jornada.</h1>
          <p className="text-muted-foreground mb-8 text-sm">Crie sua conta gratuita em segundos.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Nome completo</label>
              <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none rounded-md transition" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">E-mail</label>
              <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none rounded-md transition" />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Senha</label>
              <input id="password" type="password" required autoComplete="new-password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none rounded-md transition" />
              <p className="text-xs text-muted-foreground mt-2">Mínimo de 6 caracteres.</p>
            </div>
            {error && <p className="text-sm text-primary">{error}</p>}
            <button type="submit" disabled={loading} className="w-full px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
