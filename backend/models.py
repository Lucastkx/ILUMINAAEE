import datetime as dt
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    nome_social = Column(String)
    cpf = Column(String, unique=True, index=True, nullable=False)
    sexo = Column(String)
    nascimento = Column(String)
    email = Column(String)
    celular = Column(String)
    cep = Column(String)
    rua = Column(String)
    numero = Column(String)
    bairro = Column(String)
    cidade = Column(String)
    estado = Column(String)
    senha_hash = Column(String, nullable=False)
    role = Column(String, default="usuario")  # "usuario" | "tecnico" | "admin"
    ativo = Column(Boolean, default=True)     # False = conta excluída (mantém o histórico)


class Ocorrencia(Base):
    __tablename__ = "ocorrencias"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, index=True)
    rua = Column(String)
    bairro = Column(String)
    codigo_poste = Column(String)
    lampada_acesa = Column(Boolean)
    sem_energia = Column(Boolean)
    descricao = Column(String)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    fotos = Column(String, default="")
    status = Column(String, default="pendente")  # pendente | em_atendimento | resolvido
    criado_em = Column(DateTime, default=dt.datetime.utcnow)