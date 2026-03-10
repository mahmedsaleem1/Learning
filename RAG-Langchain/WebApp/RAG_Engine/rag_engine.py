import os
from langchain.chat_models import init_chat_model
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.tools import tool
from langgraph.prebuilt import create_react_agent

class CompanyRAGEngine:
    def __init__(self, file_path="../../Indexing/company-info.txt"):
        """
        Initializes the RAG Engine: loads embeddings, 
        indexes the document, and prepares the agent.
        """
        # 1. Initialize Components
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
        
        # Using a model capable of tool-calling (Mistral or Llama-3 recommended)
        self.model = init_chat_model(
            "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            model_provider="huggingface",
            temperature=0.01,
            max_tokens=1024,
        )

        # 2. Setup Vector Store & Indexing
        self.vector_store = InMemoryVectorStore(self.embeddings)
        self._index_document(file_path)

        # 3. Setup Agent & Tools
        self.tools = [self._get_retrieval_tool()]
        self.system_message = (
            "You are a helpful assistant for Contoso Tech Solutions. "
            "You MUST use the 'retrieve_company_info' tool to answer questions about the company. "
            "Base your answers solely on the retrieved context."
        )
        self.agent = create_react_agent(self.model, self.tools, prompt=self.system_message)

    def _index_document(self, file_path):
        """Internal method for document processing."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Document not found at: {file_path}")

        loader = TextLoader(file_path, encoding="utf-8")
        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=400,
            chunk_overlap=50
        )
        all_splits = text_splitter.split_documents(docs)
        self.vector_store.add_documents(documents=all_splits)

    def _get_retrieval_tool(self):
        """Defines the tool used by the agent for vector search."""
        @tool
        def retrieve_company_info(query: str):
            """Search the company database for info on policies, products, and history."""
            retrieved_docs = self.vector_store.similarity_search(query, k=2)
            return "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        return retrieve_company_info

    def get_answer(self, user_query: str):
        # 1. Manually get the context (This is the 'R' in RAG)
        retrieved_docs = self.vector_store.similarity_search(user_query, k=2)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        # 2. Create a simple prompt for the small model
        prompt = (
            f"Context: {context}\n\n"
            f"User Question: {user_query}\n\n"
            f"Answer based ONLY on the context above. If not found, say you don't know."
        )
        
        # 3. Use the model directly (not the agent)
        response = self.model.invoke(prompt)
        
        # 4. Clean up the response (TinyLlama tends to repeat the prompt)
        answer = response.content.split("Answer based ONLY on the context above.")[-1].strip()
        return answer