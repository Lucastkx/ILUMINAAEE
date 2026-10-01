from typing import Optional
from pydantic import BaseModel, Field


class RegisterIn(BaseModel):
    nome: str = Field(min_length=3)
    nome_social: Optional[str] = ""
    cpf: str = Field(min_length=11)
    sexo: str
    nascimento: str
    email: str
    celular: str
    cep: str
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    senha: str = Field(min_length=6)


class LoginIn(BaseModel):
    cpf: str
    senha: str