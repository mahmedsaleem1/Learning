import os
from langchain.chat_models import init_chat_model

# Set your HF token via: $env:HUGGINGFACEHUB_API_TOKEN = "your_token_here" (PowerShell)
# or export HUGGINGFACEHUB_API_TOKEN="your_token_here" (Bash)

model = init_chat_model(
    "microsoft/Phi-3-mini-4k-instruct",
    model_provider="huggingface",
    temperature=0.7,
    max_tokens=1024,
)