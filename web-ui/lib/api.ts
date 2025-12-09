import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export interface StatsResponse {
    total_facts: number;
    storage_type: string;
    index_name?: string;
}

export interface Fact {
    id: string;
    content: string;
    category: string;
    timestamp?: string;
    metadata: Record<string, any>;
}

export interface QueryResponse {
    answer: string;
    retrieved_facts: Fact[];
}

export const api = {
    getStats: async (): Promise<StatsResponse> => {
        const response = await axios.get(`${API_BASE_URL}/stats`);
        return response.data;
    },

    getFacts: async (limit = 50, offset = 0): Promise<Fact[]> => {
        const response = await axios.get(`${API_BASE_URL}/facts`, {
            params: { limit, offset },
        });
        return response.data;
    },

    query: async (query: string): Promise<QueryResponse> => {
        const response = await axios.post(`${API_BASE_URL}/query`, {
            query,
            top_k: 5,
        });
        return response.data;
    },

    importData: async (file: File, type: "chatgpt" | "claude") => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${API_BASE_URL}/import`, formData, {
            params: { type },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
