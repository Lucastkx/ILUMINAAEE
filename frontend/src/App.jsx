import { useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { api, auth } from "./api";

const Field = ({ label, ...p }) => (
  <label className="block text-sm font-semibold mb-3">{label}<input className="input mt-1 font-normal" {...p} /></label>
);
const Header = ({ title, back }) => (
  <header className="bg-ouro text-white font-bold text-center py-3 relative">
    {back && <Link to={back} className="absolute left-4" aria-label="Voltar">←</Link>}{title}
  </header>
);
// Moldura: celular ocupa a tela toda; no PC vira um painel centralizado e mais largo
const Shell = ({ children, title, back }) => (
  <div className="min-h-screen flex md:items-center md:justify-center md:p-8">
    <main className="w-full md:max-w-2xl bg-papel md:rounded-xl md:shadow-lg overflow-hidden">
      {title && <Header title={title} back={back} />}
      <div className="p-6 md:p-10">{children}</div>
    </main>
  </div>
);
const Logo = () => (
  <div className="text-center my-4">
    {/* Coloque sua imagem em public/logo.png */}
    <img src="/logo.png" alt="Ilumina Aeee!" className="mx-auto w-40 md:w-52" onError={(e) => (e.target.style.display = "none")} />
    <h1 className="text-2xl font-bold text-ouro">Ilumina Aeee!</h1>
  </div>
);
const Private = ({ children }) => (auth.get() ? children : <Navigate to="/login" />);
const Err = ({ msg }) => msg && <p role="alert" className="text-red-700 text-sm mb-3">{msg}</p>;

function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ cpf: "", senha: "" });
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api("/auth/login", { method: "POST", json: f });
      auth.set(r);
      nav(r.role === "tecnico" ? "/tecnico" : "/app"); // painel do técnico virá depois
    } catch (x) { setErr(x.message); }
  };
  return (
    <Shell>
      <Logo />
      <form onSubmit={submit} className="max-w-sm mx-auto">
        <Field label="CPF" value={f.cpf} onChange={(e) => setF({ ...f, cpf: e.target.value })} inputMode="numeric" required />
        <Field label="Senha" type="password" value={f.senha} onChange={(e) => setF({ ...f, senha: e.target.value })} required />
        <Err msg={err} />
        <div className="text-center"><button className="btn">Entrar</button></div>
        <p className="text-center text-sm mt-4"><Link to="/recuperar" className="text-ouro underline">Esqueceu a senha?</Link></p>
        <p className="text-center text-sm mt-2"><Link to="/cadastro" className="text-ouro underline">Novo cadastro</Link></p>
      </form>
    </Shell>
  );
}

const vazio = { nome: "", nome_social: "", cpf: "", sexo: "FEM", nascimento: "", email: "", celular: "",
  cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "", senha: "", confirma: "" };

function Cadastro() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [f, setF] = useState(vazio);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const next = (e) => { e.preventDefault(); setErr(""); setStep(step + 1); };
  const send = async (e) => {
    e.preventDefault();
    if (f.senha !== f.confirma) return setErr("As senhas não conferem");
    try {
      const { confirma, ...body } = f;
      await api("/auth/register", { method: "POST", json: body });
      nav("/login");
    } catch (x) { setErr(x.message); }
  };
  return (
    <Shell title="Cadastro" back="/login">
      {step === 1 && (
        <form onSubmit={next} className="md:grid md:grid-cols-2 md:gap-x-6">
          <Field label="Nome completo" value={f.nome} onChange={set("nome")} required />
          <Field label="Nome social" value={f.nome_social} onChange={set("nome_social")} />
          <Field label="CPF" value={f.cpf} onChange={set("cpf")} inputMode="numeric" required />
          <fieldset className="mb-3 text-sm font-semibold">Sexo
            <div className="flex gap-4 mt-2 font-normal">
              {["FEM", "MASC"].map((s) => (
                <label key={s}><input type="radio" name="sexo" checked={f.sexo === s} onChange={() => setF({ ...f, sexo: s })} /> {s}</label>
              ))}
            </div>
          </fieldset>
          <Field label="Data de nascimento" type="date" value={f.nascimento} onChange={set("nascimento")} required />
          <Field label="E-mail" type="email" value={f.email} onChange={set("email")} required />
          <Field label="Celular" value={f.celular} onChange={set("celular")} inputMode="tel" required />
          <div className="md:col-span-2 text-center mt-2"><button className="btn">Continuar</button></div>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={next} className="md:grid md:grid-cols-2 md:gap-x-6">
          <h2 className="md:col-span-2 text-center text-lg font-bold text-ouro mb-3">Endereço</h2>
          {[["cep", "CEP"], ["rua", "Rua"], ["numero", "Número"], ["bairro", "Bairro"], ["cidade", "Cidade"], ["estado", "Estado"]].map(([k, l]) => (
            <Field key={k} label={l} value={f[k]} onChange={set(k)} required />
          ))}
          <div className="md:col-span-2 text-center mt-2"><button className="btn">Continuar</button></div>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={send} className="max-w-sm mx-auto">
          <h2 className="text-center text-lg font-bold text-ouro mb-3">Senha</h2>
          <Field label="Senha" type="password" minLength={6} value={f.senha} onChange={set("senha")} required />
          <Field label="Confirmar senha" type="password" value={f.confirma} onChange={set("confirma")} required />
          <Err msg={err} />
          <div className="text-center"><button className="btn">Cadastrar</button></div>
        </form>
      )}
    </Shell>
  );
}

function Dashboard() {
  const a = auth.get();
  const nav = useNavigate();
  const Card = ({ to, label }) => (
    <Link to={to} className="flex items-center justify-center text-center h-32 border border-ouro rounded-lg bg-white font-semibold text-ouro hover:bg-mel">{label}</Link>
  );
  return (
    <Shell title={`Olá, ${a?.nome || ""}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card to="/app/ocorrencia" label="Adicionar defeituosas" />
        <Card to="/app/ocorrencia" label="Pesquisar localidade" />
      </div>
      <p className="text-center mt-8">
        <button className="btn" onClick={() => { auth.clear(); nav("/login"); }}>Sair</button>
      </p>
    </Shell>
  );
}

function NovaOcorrencia() {
  const nav = useNavigate();
  const [f, setF] = useState({ rua: "", bairro: "", codigo_poste: "", lampada_acesa: "true", sem_energia: "false", descricao: "" });
  const [fotos, setFotos] = useState([]);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const Sim = ({ k, label }) => (
    <fieldset className="mb-3 text-sm font-semibold">{label}
      <div className="flex gap-4 mt-2 font-normal">
        {[["true", "Sim"], ["false", "Não"]].map(([v, l]) => (
          <label key={v}><input type="radio" name={k} checked={f[k] === v} onChange={() => setF({ ...f, [k]: v })} /> {l}</label>
        ))}
      </div>
    </fieldset>
  );
  const send = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(f).forEach(([k, v]) => form.append(k, v));
    fotos.forEach((p) => form.append("fotos", p));
    try { await api("/ocorrencias", { method: "POST", form }); nav("/app/confirmacao"); }
    catch (x) { setErr(x.message); }
  };
  return (
    <Shell title="Cadastro de poste com defeito" back="/app">
      <form onSubmit={send} className="md:grid md:grid-cols-2 md:gap-x-6">
        <Field label="Rua" value={f.rua} onChange={set("rua")} required />
        <Field label="Bairro" value={f.bairro} onChange={set("bairro")} required />
        <Field label="Código do poste" value={f.codigo_poste} onChange={set("codigo_poste")} />
        <div />
        <Sim k="lampada_acesa" label="O poste está com a lâmpada?" />
        <Sim k="sem_energia" label="O poste está sem energia?" />
        <label className="block text-sm font-semibold mb-3 md:col-span-2">Descreva brevemente o problema
          <textarea className="input mt-1 font-normal" rows={3} value={f.descricao} onChange={set("descricao")} />
        </label>
        <label className="block text-sm font-semibold mb-3 md:col-span-2">Foto do poste (até 2 fotos)
          <input className="input mt-1 font-normal" type="file" accept="image/*" multiple
            onChange={(e) => setFotos([...e.target.files].slice(0, 2))} />
        </label>
        <div className="md:col-span-2"><Err msg={err} /></div>
        <div className="md:col-span-2 text-center"><button className="btn">Salvar</button></div>
      </form>
    </Shell>
  );
}

const Confirmacao = () => (
  <Shell title="Confirmação de ocorrência">
    <p className="text-center my-10">Sua ocorrência foi registrada com sucesso. A equipe técnica já foi notificada.</p>
    <p className="text-center"><Link to="/app" className="btn inline-block">Início</Link></p>
  </Shell>
);

const EmBreve = ({ t }) => <Shell title={t} back="/login"><p className="text-center py-10">Em breve.</p></Shell>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar" element={<EmBreve t="Redefinir senha" />} />
      <Route path="/app" element={<Private><Dashboard /></Private>} />
      <Route path="/app/ocorrencia" element={<Private><NovaOcorrencia /></Private>} />
      <Route path="/app/confirmacao" element={<Private><Confirmacao /></Private>} />
      <Route path="/tecnico/*" element={<Private><EmBreve t="Painel do técnico" /></Private>} />
    </Routes>
  );
}
