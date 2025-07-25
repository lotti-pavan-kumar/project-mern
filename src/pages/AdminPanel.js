import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        setTickets(data);
      } catch (err) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/tickets/${id}`, { status });
      setTickets(tickets.map(t => t._id === id ? { ...t, status } : t));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets(tickets.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete ticket');
    }
  };

  if (!user || user.role !== 'admin') return <div className="p-8">Not authorized.</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket._id} className="border rounded p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">{ticket.title}</div>
              <div className="text-sm text-gray-600">Status: {ticket.status} | Priority: {ticket.priority}</div>
              <div className="text-xs text-gray-500">Created by: {ticket.createdBy?.name || 'N/A'}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <select value={ticket.status} onChange={e => handleStatus(ticket._id, e.target.value)} className="border rounded p-1">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <button onClick={() => handleDelete(ticket._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel; 