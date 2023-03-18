import { useEffect, useState } from "react";

const useFetch = (url) => {
	const [data, setData] = useState();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const fetchData = async (token) => {
      try {
				const response = await fetch(url, { mode: 'cors', credentials: 'include',
				headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
        const json = await response.json();
        setData(json);
		} catch (error) {
			setError(error);
      } finally {
        setLoading(false);
      }
    };

		fetch('https://api.wisey.app/api/v1/auth/anonymous?platform=subscriptions')
			.then(response => response.json())
			.then(data => fetchData(data.token))
    
	}, [url]);

	return { data, error, loading };
};

export default useFetch;
