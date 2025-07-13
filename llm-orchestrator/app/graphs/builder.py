from langgraph.graph import StateGraph, END, START
from .state import AgentState
from .nodes import (
    ruya_node,
    preprocessing_node,
    analytics_node,
    reporter_node,
    ml_node  
)
from langgraph.checkpoint.memory import MemorySaver

def create_orchestrator(checkpointer=None) -> StateGraph:
    """Create and compile the state graph for the agent workflow."""
    
    def route_after_agent(state: AgentState) -> str:
        """Route to END if status is DONE, otherwise return to ruya."""
        return END if state.get("status") == "DONE" else "ruya"
    
    graph = (
        StateGraph(AgentState)
        .add_node("ruya", ruya_node, destinations=("preprocessing_agent", "analytics_agent", "ml_agent", "reporter", END))
        .add_node("preprocessing_agent", preprocessing_node)
        .add_node("analytics_agent", analytics_node)
        .add_node("ml_agent", ml_node)
        .add_node("reporter", reporter_node)
        .add_edge(START, "ruya")
        # Conditional edges for agents
        .add_conditional_edges(
            "preprocessing_agent",
            route_after_agent,
            {"ruya": "ruya", END: END}
        )
        .add_conditional_edges(
            "analytics_agent",
            route_after_agent,
            {"ruya": "ruya", END: END}
        )
        .add_conditional_edges(
            "ml_agent",
            route_after_agent,
            {"ruya": "ruya", END: END}
        )
        .add_edge("reporter", END)
    )
    return graph.compile(checkpointer=checkpointer)