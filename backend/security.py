import os
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User

SECRET = os.getenv("SECRET_KEY", "troque-esta-chave")
oauth = OAuth2PasswordBearer(tokenUrl="auth/login")


def only_digits(s):
    return "".join(c for c in s if c.isdigit())


def current_user(token: str = Depends(oauth), db: Session = Depends(get_db)) -> User:
    try:
        uid = jwt.decode(token, SECRET, algorithms=["HS256"])["sub"]
    except jwt.PyJWTError:
        raise HTTPException(401, "Sessão inválida")
    user = db.get(User, int(uid))
    if not user or not user.ativo:
        raise HTTPException(401, "Usuário não encontrado")
    return user


def require_role(*roles: str):
    """Aceita um ou mais perfis: require_role("tecnico", "admin")"""
    def dep(user: User = Depends(current_user)):
        if user.role not in roles:
            raise HTTPException(403, "Acesso não permitido para este perfil")
        return user
    return dep