import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/programas")({
  component: ProgramsPage,
  head: () => ({
    meta: [
      { title: "Programas — Saber Aberto" },
      { name: "description", content: "Trilhas de aprendizagem, formação docente e bibliotecas vivas. Inscreva-se gratuitamente." },
      { property: "og:title", content: "Programas — Saber Aberto" },
      { property: "og:description", content: "Trilhas de aprendizagem, formação docente e bibliotecas vivas." },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
});

type Category = "Todos" | "Docentes" | "Infância" | "Juventude" | "Comunidade";
type Level = "Todos" | "Iniciante" | "Intermediário" | "Avançado";

type Program = {
  slug: string;
  title: string;
  category: Exclude<Category, "Todos">;
  level: Exclude<Level, "Todos">;
  duration: string;
  format: string;
  spots: number;
  short: string;
  description: string;
  highlights: string[];
};

const PROGRAMS: Program[] = [
  {
    slug: "escola-que-forma",
    title: "Escola que Forma Quem Forma",
    category: "Docentes",
    level: "Intermediário",
    duration: "16 semanas",
    format: "Híbrido",
    spots: 1200,
    short: "Formação continuada para professores da rede pública.",
    description:
      "Programa que combina encontros presenciais regionais com mentoria online. Foco em metodologias ativas, avaliação formativa e práticas antirracistas em sala de aula.",
    highlights: ["Mentoria 1:1", "Certificação 240h", "Material aberto"],
  },
  {
    slug: "bibliotecas-vivas",
    title: "Bibliotecas Vivas",
    category: "Comunidade",
    level: "Iniciante",
    duration: "Contínuo",
    format: "Presencial",
    spots: 80,
    short: "Bibliotecas itinerantes em bairros sem acervo público.",
    description:
      "Voluntários articulam clubes de leitura, contação de histórias e empréstimo de livros em praças, escolas e centros comunitários. Mais de 80 mil livros em circulação.",
    highlights: ["Acervo doado", "Encontros semanais", "Coletivo local"],
  },
  {
    slug: "trilha-juventudes",
    title: "Trilha Juventudes Digitais",
    category: "Juventude",
    level: "Iniciante",
    duration: "12 semanas",
    format: "Online",
    spots: 500,
    short: "Lógica, programação e cidadania digital para 14-22 anos.",
    description:
      "Trilha gamificada com projetos práticos: do primeiro algoritmo ao deploy de uma página. Inclui rodas de conversa sobre uso ético de tecnologia.",
    highlights: ["Projetos reais", "Mentores voluntários", "Bolsa de estudos"],
  },
  {
    slug: "letramento-infancia",
    title: "Letramento na Primeira Infância",
    category: "Infância",
    level: "Iniciante",
    duration: "8 semanas",
    format: "Híbrido",
    spots: 300,
    short: "Apoio a famílias e cuidadores de crianças de 0 a 6 anos.",
    description:
      "Oficinas práticas com base científica sobre vínculo, brincar, leitura compartilhada e desenvolvimento da linguagem na primeira infância.",
    highlights: ["Material impresso", "Encontros locais", "Tutoria por WhatsApp"],
  },
  {
    slug: "lideranca-pedagogica",
    title: "Liderança Pedagógica",
    category: "Docentes",
    level: "Avançado",
    duration: "24 semanas",
    format: "Online",
    spots: 200,
    short: "Para coordenadores e gestores escolares.",
    description:
      "Trilha intensiva de gestão escolar com base em evidências: clima de aprendizagem, observação de aula, planos de melhoria e indicadores de equidade.",
    highlights: ["Estudos de caso", "Banca final", "Rede de pares"],
  },
  {
    slug: "circulos-comunitarios",
    title: "Círculos Comunitários de Estudo",
    category: "Comunidade",
    level: "Iniciante",
    duration: "Contínuo",
    format: "Presencial",
    spots: 1000,
    short: "Grupos de estudo autogeridos em todo o Brasil.",
    description:
      "Apoiamos coletivos com kit metodológico, formação de facilitadores e plataforma para registrar encontros. Educação popular, escuta e horizontalidade.",
    highlights: ["Kit pronto", "Encontros mensais", "Sem pré-requisitos"],
  },
];

const CATEGORIES: Category[] = ["Todos", "Docentes", "Infância", "Juventude", "Comunidade"];
const LEVELS: Level[] = ["Todos", "Iniciante", "Intermediário", "Avançado"];

function ProgramsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<Category>("Todos");
  const [level, setLevel] = useState<Level>("Todos");
  const [query, setQuery] = useState("");
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setEnrolled(new Set());
      return;
    }
    supabase
      .from("enrollments")
      .select("program_slug")
      .then(({ data }) => {
        if (data) setEnrolled(new Set(data.map((d) => d.program_slug)));
      });
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return PROGRAMS.filter((p) => {
      if (category !== "Todos" && p.category !== category) return false;
      if (level !== "Todos" && p.level !== level) return false;
      if (query.trim() && !`${p.title} ${p.short} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [category, level, query]);

  async function enroll(p: Program) {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setPending(p.slug);
    const { error } = await supabase.from("enrollments").insert({ user_id: user.id, program_slug: p.slug });
    setPending(null);
    if (error) {
      setToast({ msg: error.code === "23505" ? "Você já está inscrito neste programa." : "Não foi possível inscrever. Tente novamente.", kind: "err" });
      return;
    }
    setEnrolled((prev) => new Set(prev).add(p.slug));
    setToast({ msg: `Inscrição realizada em "${p.title}".`, kind: "ok" });
  }

  return (
    <main className="min-h-screen bg-background text-foreground grain">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="inline-block w-6 h-6 bg-primary rounded-sm rotate-45" />
            Saber Aberto
          </Link>
          <nav className="text-sm flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition">Início</Link>
            {user ? (
              <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 rounded-full border border-ink/20 hover:bg-ink hover:text-cream transition">Sair</button>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition">Entrar</Link>
            )}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Programas</div>
        <h1 className="font-display text-5xl md:text-7xl font-light leading-[0.95] max-w-4xl text-balance">
          Trilhas de aprendizagem para cada <em className="italic text-primary">momento</em> da vida.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Seis programas ativos, todos gratuitos, co-criados com educadores e comunidades parceiras.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="border-y border-border py-6 grid lg:grid-cols-[1fr_auto_auto] gap-6 items-end">
          <div>
            <label htmlFor="q" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Buscar</label>
            <input
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: leitura, programação, gestão…"
              className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none rounded-md transition"
            />
          </div>
          <div>
            <div className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Categoria</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 text-sm rounded-full border transition ${category === c ? "bg-ink text-cream border-ink" : "border-border hover:border-primary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Nível</div>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 text-sm rounded-full border transition ${level === l ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {filtered.length} programa{filtered.length === 1 ? "" : "s"} encontrado{filtered.length === 1 ? "" : "s"}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-md p-16 text-center text-muted-foreground">
            Nenhum programa corresponde aos filtros. Tente outra combinação.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((p) => {
              const isEnrolled = enrolled.has(p.slug);
              const isPending = pending === p.slug;
              return (
                <article key={p.slug} className="group border border-border rounded-md p-8 flex flex-col bg-card hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs uppercase tracking-wider text-primary font-medium">{p.category}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{p.level}</span>
                  </div>
                  <h2 className="font-display text-3xl leading-tight mb-3">{p.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{p.description}</p>

                  <dl className="grid grid-cols-3 gap-4 py-5 border-y border-border text-sm">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Duração</dt>
                      <dd className="font-medium mt-1">{p.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Formato</dt>
                      <dd className="font-medium mt-1">{p.format}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Vagas</dt>
                      <dd className="font-medium mt-1">{p.spots}</dd>
                    </div>
                  </dl>

                  <ul className="my-6 flex flex-wrap gap-2">
                    {p.highlights.map((h) => (
                      <li key={h} className="text-xs px-3 py-1.5 bg-muted rounded-full text-muted-foreground">{h}</li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <button
                      onClick={() => enroll(p)}
                      disabled={isEnrolled || isPending}
                      className={`px-6 py-3 rounded-full font-medium transition ${isEnrolled ? "bg-muted text-muted-foreground cursor-default" : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"}`}
                    >
                      {isEnrolled ? "✓ Inscrito" : isPending ? "Enviando…" : user ? "Solicitar inscrição" : "Entrar para inscrever"}
                    </button>
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition">→</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {toast && (
        <div role="status" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-lg text-sm font-medium ${toast.kind === "ok" ? "bg-ink text-cream" : "bg-primary text-primary-foreground"}`}>
          {toast.msg}
        </div>
      )}

      <footer className="border-t border-border bg-ink text-cream/70 py-10">
        <div className="mx-auto max-w-7xl px-6 text-sm flex flex-wrap justify-between gap-4">
          <span>© 2026 Saber Aberto · ODS 4</span>
          <Link to="/" className="hover:text-primary">Voltar ao início</Link>
        </div>
      </footer>
    </main>
  );
}
