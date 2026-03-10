# *****************COMPONENTS STUFF*****************
# Chat model
import os
from langchain.chat_models import init_chat_model

# Set your HF token via: $env:HUGGINGFACEHUB_API_TOKEN = "your_token_here" (PowerShell)
# or export HUGGINGFACEHUB_API_TOKEN="your_token_here" (Bash)

model = init_chat_model(
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    model_provider="huggingface",
    temperature=0.7,
    max_tokens=1024,
)

# Embedding model
from langchain_huggingface import HuggingFaceEmbeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# Vector store
from langchain_core.vectorstores import InMemoryVectorStore
vector_store = InMemoryVectorStore(embeddings)


# *****************INDEXING STUFF********************
# LOAD DOCUMENT
from langchain_community.document_loaders import TextLoader

loader = TextLoader("company-info.txt", encoding="utf-8")
docs = loader.load()

assert len(docs) == 1
print(f"Total characters: {len(docs[0].page_content)}")


# SPLIT DOCUMENT
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=400,  # chunk size (characters)
    chunk_overlap=50,  # chunk overlap (characters)
    add_start_index=True,  # track index in original document
)
all_splits = text_splitter.split_documents(docs)

print(f"Split company info into {len(all_splits)} sub-documents.")


# EMBED AND STORE IN VECTOR DATABASE
document_ids = vector_store.add_documents(documents=all_splits)

print(document_ids[:3])


# *****************RETREIVAL AND GENERATION********************
# Get relevant context for a query
# 1. TOOL DEFINITION
from langchain.tools import tool

@tool
def retrieve_company_info(query: str):
    """Search the company database for answers."""
    # This is where the retrieval actually happens
    print(f"\n[DEBUG] Tool called with query: {query}") 
    retrieved_docs = vector_store.similarity_search(query, k=2)
    
    context = "\n".join([d.page_content for d in retrieved_docs])
    print(f"[DEBUG] Found {len(retrieved_docs)} relevant chunks.")
    return context

# --- MANUAL TEST (Run this BEFORE the agent) ---
print("\n--- Manual Retrieval Test ---")
# We call the function directly (bypassing the AI) to see if it works
test_results = retrieve_company_info.invoke("remote work")
print(f"Retrieved content snippet: {test_results[:300]}...") 
print("--- End of Manual Test ---\n")

# 2. AGENT SETUP
from langgraph.prebuilt import create_react_agent

tools = [retrieve_company_info]
# We tell the model: "If you don't know, use the tool!"
system_message = (
    "You are a helpful assistant. "
    "To answer any question, you MUST first call the 'retrieve_company_info' tool. "
    "Do not answer until you have called the tool. "
    "Question: {input}"
)

# Set temperature to 0 for maximum logic/minimum 'guessing'
model.temperature = 0

app = create_react_agent(model, tools, prompt=system_message)

# 3. SIMPLIFIED QUERY
query = "In which year was the company founded?"

# 4. RUN AND PRINT EVERYTHING
print("\n--- Starting Agent ---")
inputs = {"messages": [("user", query)]}

# We use a loop so we can see the "Thought", the "Tool Call", and the "Final Answer"
for event in app.stream(inputs, stream_mode="values"):
    message = event["messages"][-1]
    message.pretty_print()