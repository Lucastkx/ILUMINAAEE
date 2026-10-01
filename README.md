# Ilumina Aeee!

## Back-end
cd backend
#python -m venv .venv        (vai criar o ambiente virtual chamado .venv)

.venv\Scripts\Activate.ps1 (Liga esse ambiente no terminal. Depois disso, python e pip passam a usar a caixa isolada, e o prompt mostra (.venv) no começo da linha. Isso vale só para aquele terminal. Se você fechar e abrir outro, precisa ativar de novo.)

pip install -r requirements.txt
pip é o instalador de bibliotecas do Python. A opção -r manda ele ler a lista do arquivo requirements.txt e instalar tudo o que está nela: FastAPI (a API), uvicorn (o servidor), SQLAlchemy (o banco de dados), PyJWT (o login com token), bcrypt (a criptografia das senhas) e python-multipart (o envio de fotos). Só precisa rodar uma vez, ou de novo se a lista mudar.

uvicorn main:app --reload (liga o servidor)

 # http://localhost:8000/docs

## Front-end
cd frontend && npm install && npm run dev   # http://localhost:5173
npm install
O npm é o instalador de bibliotecas do JavaScript, parecido com o pip do Python. Esse comando lê o arquivo package.json e baixa tudo o que o site precisa para a pasta node_modules:

React: constrói as telas.
React Router: troca de tela sem recarregar a página.
Tailwind: cuida do visual.
Vite: o servidor de desenvolvimento.
Leaflet: o mapa, que vamos usar na tela do técnico.

npm run dev    (liga o servidor)
