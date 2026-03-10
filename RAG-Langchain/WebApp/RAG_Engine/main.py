from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from rag_engine import CompanyRAGEngine

# 1. Initialize FastAPI app
app = FastAPI()

# 2. Initialize RAG Engine once (this loads the model into RAM)
rag_service = CompanyRAGEngine()

# 3. Define the Request Body structure
class Query(BaseModel):
    text: str

# 4. Define the API Route
@app.post("/ask")
async def ask_company_bot(query: Query):
    # This calls your rag_engine.py logic
    answer = rag_service.get_answer(query.text)
    return {"answer": answer}

# 5. Start the Server
if __name__ == "__main__":
    # host "0.0.0.0" allows access from your local network
    # port 8000 is the standard FastAPI default
    uvicorn.run(app, host="localhost", port=8000)