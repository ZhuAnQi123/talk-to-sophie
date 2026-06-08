# exceptions.py
import logging
from fastapi import HTTPException
from openai import (
    APIConnectionError, APITimeoutError, RateLimitError,
    AuthenticationError, BadRequestError, APIStatusError,
)

logger = logging.getLogger(__name__)

# 异常类型 → (状态码, 用户提示, 日志级别)
_ERROR_MAP: list[tuple[type, int, str, str]] = [
    (RateLimitError,       429, "请求过于频繁，请稍后再试", "warning"),
    (APITimeoutError,      504, "模型服务响应超时",         "error"),
    (APIConnectionError,   503, "无法连接模型服务",         "error"),
    (AuthenticationError,  500, "服务配置异常",             "error"),
    (BadRequestError,      400, "请求无效或内容过长",       "warning"),
    (APIStatusError,       502, "上游模型服务异常",         "error"),
]

def raise_for_openai_error(exc: Exception) -> None:
    """将 OpenAI SDK 异常转为 HTTPException，永不返回。"""
    for exc_type, status, detail, level in _ERROR_MAP:
        if isinstance(exc, exc_type):
            getattr(logger, level)("%s: %s", exc_type.__name__, exc)
            raise HTTPException(status_code=status, detail=detail)
    logger.exception("Unexpected error")
    raise HTTPException(status_code=500, detail="服务器内部错误")