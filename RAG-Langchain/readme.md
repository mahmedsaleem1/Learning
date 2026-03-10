# 🤖 RAG-Based Knowledge Agent

This repository implements a **Retrieval-Augmented Generation (RAG)** system using an autonomous agent. Instead of relying on pre-trained knowledge, the agent "searches" a local database to provide accurate, document-based answers.

---

## 🏗️ System Architecture

The project is divided into three functional layers: **Components**, **Indexing**, and **Execution**.



### 1. Core Components
The system integrates three primary technologies to handle AI reasoning and data retrieval:
* **Chat Model:** A lightweight LLM (TinyLlama) that acts as the reasoning engine.
* **Embedding Model:** A transformer model that converts text into numerical vectors (mathematical representations of meaning).
* **Vector Store:** An in-memory database used to store and search these vectors based on semantic similarity.

### 2. The Indexing Pipeline
Before the agent can answer questions, it must process the source data:
1.  **Loading:** Raw text is imported from local files (e.g., `company-info.txt`).
2.  **Splitting:** Large documents are broken into smaller chunks (e.g., 400 characters) with a slight overlap. This ensures that the agent retrieves specific, relevant snippets rather than overwhelming amounts of text.
3.  **Storage:** These chunks are embedded and indexed within the Vector Store.

### 2. Retreival and Generation

---

## 🧠 Agent Logic & Retrieval

The "Intelligence" of this system relies on a **ReAct (Reasoning + Acting)** framework. Instead of a standard chatbot, this is a tool-using agent.

### 🛠️ The Retrieval Tool
A custom Python function is defined as a **Tool**. This allows the LLM to programmatically "call" the vector store to fetch relevant document snippets.

### 🔄 The Execution Loop
When a user asks a question, the agent follows this logic:
1.  **Analyze:** The agent receives the query.
2.  **Act:** Because of the system prompt, the agent **must** call the `retrieve_company_info` tool.
3.  **Search:** The tool performs a similarity search in the Vector Store.
4.  **Synthesize:** The agent receives the search results and uses them as "context" to formulate a factual final answer.

> **Note:** The model temperature is set to `0` to ensure maximum logic and minimize "hallucinations" or creative guessing.

---

## 🚀 Key Features
* **Autonomous Tool Use:** The agent decides when and how to search the database.
* **Semantic Search:** Finds answers based on meaning, not just keyword matching.
* **Traceable Reasoning:** Uses a streaming mode to display "Thoughts," "Tool Calls," and "Final Answers" in the console.

## 🛠️ Requirements
* **API Access:** A Hugging Face Hub Token is required for model inference.
* **Libraries:** `langchain`, `langgraph`, `sentence-transformers`.