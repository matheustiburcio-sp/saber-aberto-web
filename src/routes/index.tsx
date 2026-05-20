import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-education.jpg";
import readingImg from "@/assets/edu-reading.jpg";
import teacherImg from "@/assets/edu-teacher.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Saber Aberto — Educação de Qualidade para Todos | ODS 4" },
      { name: "description", content: "Plataforma educacional alinhada ao ODS 4 da ONU. Acesso livre ao conhecimento, mentorias e trilhas de aprendizagem para transformar realidades." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground grain">
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />
      <Pillars />
      <Stats />
      <Programs />
      <Quote />
      <CTA />
      <Footer />
    </main>
  );
}

function Nav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="inline-block w-6 h-6 bg-primary rounded-sm rotate-45" />
          Saber Aberto
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#manifesto" className="hover:text-primary transition">Manifesto</a>
          <a href="#pilares" className="hover:text-primary transition">Pilares</a>
          <Link to="/programas" className="hover:text-primary transition">Programas</Link>
          <a href="#contato" className="hover:text-primary transition">Contato</a>
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[160px]">{user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm font-medium px-4 py-2 rounded-full border border-ink/20 hover:bg-ink hover:text-cream transition"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline text-sm font-medium px-4 py-2 hover:text-primary transition">
              Entrar
            </Link>
            <Link to="/signup" className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition">
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
      <div className="grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-medium mb-8">
            <span className="w-8 h-px bg-primary" />
            ODS 4 · Educação de Qualidade
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-light text-balance">
            O conhecimento <em className="italic text-primary">não</em> deveria ser privilégio.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Saber Aberto conecta estudantes, educadores e comunidades para garantir educação inclusiva,
            equitativa e de qualidade — em qualquer lugar, para qualquer pessoa.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/programas" className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
              Explorar programas
            </Link>
            <a href="#manifesto" className="px-7 py-3.5 rounded-full border border-ink/20 hover:bg-ink hover:text-cream transition font-medium">
              Nosso manifesto
            </a>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] overflow-hidden rounded-md shadow-2xl">
            <img src={heroImg} alt="Estudantes aprendendo em sala de aula" width={1600} height={1200} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-cream border border-border p-5 max-w-[220px] shadow-lg">
            <div className="font-display text-4xl text-primary">258M</div>
            <div className="text-xs text-muted-foreground mt-1">crianças e jovens fora da escola no mundo</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Universidades públicas", "ONGs locais", "Bibliotecas comunitárias", "Professores voluntários", "Editoras independentes", "Coletivos estudantis"];
  return (
    <div className="border-y border-border/60 bg-muted/30 overflow-hidden">
      <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap py-5 gap-12 text-sm text-muted-foreground font-medium">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">{t}<span className="text-primary">✦</span></span>
        ))}
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}`}</style>
    </div>
  );
}

function Manifesto() {
  return (
    <section id="manifesto" className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">01 — Manifesto</div>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
            Aprender é um <em className="italic text-primary">direito</em>, não uma mercadoria.
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            Acreditamos que cada pessoa carrega potencial inestimável — e que esse potencial floresce quando há
            acesso a ferramentas, mentores e comunidades dispostas a caminhar junto.
          </p>
          <p>
            Construímos pontes entre quem sabe e quem quer saber. Entre instituições e periferias.
            Entre o currículo formal e os saberes ancestrais. Educação que liberta começa por <span className="text-foreground font-medium">escutar</span>.
          </p>
          <p className="font-display text-2xl text-foreground italic">
            "A educação é a arma mais poderosa que você pode usar para mudar o mundo." — Nelson Mandela
          </p>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const pillars = [
    { n: "I", t: "Acesso Universal", d: "Conteúdo gratuito, em múltiplos idiomas, otimizado para conexões lentas e dispositivos modestos." },
    { n: "II", t: "Equidade Radical", d: "Bolsas, mentorias e suporte direcionados a quem historicamente foi deixado para trás." },
    { n: "III", t: "Qualidade Viva", d: "Currículos co-criados com educadores em exercício e revisados por especialistas reconhecidos." },
    { n: "IV", t: "Comunidade", d: "Aprender junto sustenta. Círculos de estudo, clubes de leitura e encontros locais em todo o país." },
  ];
  return (
    <section id="pilares" className="bg-ink text-cream py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-cream/60 mb-4">02 — Pilares</div>
            <h2 className="font-display text-4xl md:text-5xl font-light max-w-2xl">Quatro compromissos que orientam tudo o que fazemos.</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10">
          {pillars.map((p) => (
            <div key={p.n} className="bg-ink p-8 hover:bg-primary/90 transition-colors group cursor-default min-h-[320px] flex flex-col">
              <div className="font-display text-6xl text-primary group-hover:text-cream transition">{p.n}</div>
              <h3 className="font-display text-2xl mt-8 mb-3">{p.t}</h3>
              <p className="text-cream/70 group-hover:text-cream/90 text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "47k", l: "estudantes ativos" },
    { v: "1.2k", l: "educadores parceiros" },
    { v: "180+", l: "comunidades atendidas" },
    { v: "98%", l: "conteúdo gratuito" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border py-12">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="font-display text-5xl md:text-6xl text-primary font-light">{s.v}</div>
            <div className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="programas" className="mx-auto max-w-7xl px-6 py-32">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">03 — Programas</div>
      <h2 className="font-display text-4xl md:text-5xl font-light mb-16 max-w-3xl">
        Trilhas de aprendizagem desenhadas para cada momento da vida.
      </h2>
      <div className="grid lg:grid-cols-12 gap-8">
        <article className="lg:col-span-7 group">
          <div className="aspect-[16/10] overflow-hidden rounded-md mb-6">
            <img src={teacherImg} alt="Professor em sala de aula" width={1200} height={900} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="text-xs uppercase tracking-wider text-primary mb-2">Formação docente</div>
          <h3 className="font-display text-3xl mb-3">Escola que Forma Quem Forma</h3>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Programa de formação continuada para 1.200 professores da rede pública. Metodologias ativas,
            avaliação formativa e práticas antirracistas em sala.
          </p>
        </article>
        <article className="lg:col-span-5 group">
          <div className="aspect-[4/5] overflow-hidden rounded-md mb-6">
            <img src={readingImg} alt="Jovem lendo um livro" width={1200} height={1400} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="text-xs uppercase tracking-wider text-primary mb-2">Infância & juventude</div>
          <h3 className="font-display text-3xl mb-3">Bibliotecas Vivas</h3>
          <p className="text-muted-foreground leading-relaxed">
            Bibliotecas itinerantes em bairros sem acervo público. Mais de 80 mil livros já em circulação.
          </p>
        </article>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="bg-primary text-primary-foreground py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="font-display text-3xl md:text-5xl leading-tight font-light text-balance">
          "Quando uma criança aprende a ler, ela não apenas decifra palavras —
          ela começa a reescrever a história da sua família."
        </div>
        <div className="mt-10 text-sm uppercase tracking-[0.2em] opacity-80">
          — Educadora parceira, Heliópolis · SP
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contato" className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">04 — Junte-se</div>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
            Há um lugar para <em className="italic text-primary">você</em> nessa transformação.
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { t: "Quero estudar", d: "Acesse trilhas gratuitas e mentorias." },
            { t: "Quero ensinar", d: "Compartilhe sua expertise como voluntário." },
            { t: "Quero apoiar", d: "Doe, divulgue ou torne-se parceiro institucional." },
          ].map((o) => (
            <a key={o.t} href="#" className="flex items-center justify-between p-6 border border-border hover:border-primary hover:bg-card transition-colors rounded-md group">
              <div>
                <div className="font-display text-2xl">{o.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{o.d}</div>
              </div>
              <span className="text-2xl text-primary group-hover:translate-x-1 transition-transform">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-2xl text-cream font-semibold">
            <span className="inline-block w-6 h-6 bg-primary rounded-sm rotate-45" />
            Saber Aberto
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            Iniciativa alinhada ao Objetivo de Desenvolvimento Sustentável 4 da ONU —
            assegurar a educação inclusiva, equitativa e de qualidade até 2030.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-cream mb-4">Navegar</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#manifesto" className="hover:text-primary">Manifesto</a></li>
            <li><a href="#pilares" className="hover:text-primary">Pilares</a></li>
            <li><a href="#programas" className="hover:text-primary">Programas</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-cream mb-4">Contato</div>
          <ul className="space-y-2 text-sm">
            <li>contato@saberaberto.org</li>
            <li>São Paulo · Brasil</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © 2026 Saber Aberto · Projeto A3 — Algoritmo e Programação · Universidade São Judas
      </div>
    </footer>
  );
}
