import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch, AsyncMock
from unified_llm.models import Fact

# Mock the factory to avoid real initialization
with patch('unified_llm.factory.ServiceFactory.get_instance') as mock_factory:
    mock_instance = MagicMock()
    mock_factory.return_value = mock_instance
    
    # Mock services
    mock_graph_service = MagicMock()
    mock_persona_engine = MagicMock() # We'll make methods async later
    mock_vector_store = MagicMock()
    
    mock_instance.get_components.return_value = {
        'graph_service': mock_graph_service,
        'persona_engine': mock_persona_engine,
        'vector_store': mock_vector_store,
        'retriever': MagicMock(),
        'llm_client': MagicMock(),
        'extractor': MagicMock()
    }
    
    # Import app after mocking
    from server import app

client = TestClient(app)

def test_get_graph():
    # Setup mock return
    mock_graph_data = {
        "nodes": [{"id": "1", "name": "Test Fact"}],
        "links": []
    }
    # We need to access the mock from the imported module's scope effectively
    # But since we mocked get_services in the server module via the factory patch...
    # Wait, server.py calls get_services() at startup.
    # We need to patch get_services in server.py or the factory it uses.
    pass

# Let's use a simpler approach: Patching the 'services' global in server.py
# This is easier since server.py has a global 'services' variable.

@pytest.fixture
def mock_services():
    with patch('server.services') as mock_services:
        yield mock_services

def test_graph_endpoint(mock_services):
    # Setup
    mock_graph_service = MagicMock()
    mock_graph_service.get_graph_data.return_value = {"nodes": [], "links": []}
    mock_services.get.return_value = mock_graph_service
    
    # Act
    response = client.get("/graph")
    
    # Assert
    assert response.status_code == 200
    assert response.json() == {"nodes": [], "links": []}
    # Verify we asked for the right service
    mock_services.get.assert_called_with('graph_service')

def test_persona_endpoint(mock_services):
    # Setup
    mock_persona_engine = MagicMock()
    # Make generate_persona async
    mock_persona_engine.generate_persona = AsyncMock(return_value={"bio": "Test Bio"})
    
    # Configure the mock to return the persona engine when asked
    def get_side_effect(key):
        if key == 'persona_engine':
            return mock_persona_engine
        return None
        
    mock_services.get.side_effect = get_side_effect
    
    # Act
    response = client.get("/persona")
    
    # Assert
    assert response.status_code == 200
    assert response.json() == {"bio": "Test Bio"}

# Test GraphService logic directly
from unified_llm.graph.service import GraphService

def test_graph_construction():
    mock_store = MagicMock()
    mock_store.use_mock = True
    mock_store.local_storage = {
        "1": {"id": "1", "content": "Fact 1", "category": "cat1"},
        "2": {"id": "2", "content": "Fact 2", "category": "cat1"},
    }
    
    service = GraphService(vector_store=mock_store)
    service.build_graph()
    
    assert service.graph.number_of_nodes() == 2
    # Check if we got data
    data = service.get_graph_data()
    assert len(data['nodes']) == 2
