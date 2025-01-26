import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

const fetchPracownicy = async () => {
  const { data } = await apiClient.get('/test');
  return data;
};

export default function DataList() {
  const { data, error, isLoading } = useQuery(['pracownicy'], fetchPracownicy);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <ul>
      {data.map((pracownik, index) => (
        <li key={index}>{pracownik[1]}</li>
      ))}
    </ul>
  );
}
