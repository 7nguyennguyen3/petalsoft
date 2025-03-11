from langchain.schema import HumanMessage, AIMessage
from langchain.memory.chat_memory import BaseChatMemory
from langchain_core.chat_history import (
    InMemoryChatMessageHistory,
)
from typing import List, Dict, Any
from pydantic import Field

class SlidingChatMemory(BaseChatMemory):
    max_messages: int = Field(default=10, description="Max messages to store")
    max_words: int = Field(default=600, description="Max total word count")
    chat_memory: InMemoryChatMessageHistory = Field(default_factory=InMemoryChatMessageHistory)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.chat_memory = InMemoryChatMessageHistory()

    @property
    def memory_variables(self) -> List[str]:
        return ["chat_history"]

    def load_memory_variables(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        return {"chat_history": self.chat_memory.messages}

    def save_context(self, inputs: Dict[str, Any], outputs: Dict[str, Any]) -> None:
        user_input = inputs.get("input", "")
        ai_output = outputs.get("output", "")
        
        if user_input:
            self.chat_memory.add_user_message(user_input)
        if ai_output:
            self.chat_memory.add_ai_message(ai_output)

        # Enforce message limits
        while len(self.chat_memory.messages) > self.max_messages:
            self.chat_memory.messages.pop(0)

        # Enforce word limits
        total_words = sum(len(msg.content.split()) for msg in self.chat_memory.messages)
        while total_words > self.max_words and self.chat_memory.messages:
            removed = self.chat_memory.messages.pop(0)
            total_words -= len(removed.content.split())

    def clear(self) -> None:
        self.chat_memory.clear()