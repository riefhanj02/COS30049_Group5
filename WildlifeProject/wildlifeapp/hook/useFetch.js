import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(`http://10.0.2.2:3000/${endpoint}`);
            setData(response.data);
        } catch (error) {
            setError(error);
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, isLoading, error };
};

export default useFetch;

