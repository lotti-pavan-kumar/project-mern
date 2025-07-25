import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

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

  const filteredTickets = tickets.filter(ticket => {
    return (
      (statusFilter ? ticket.status === statusFilter : true) &&
      (priorityFilter ? ticket.priority === priorityFilter : true)
    );
  });

  // Metrics for admin
  const metrics = user && user.role === 'admin' ? {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    closed: tickets.filter(t => t.status === 'Closed').length,
  } : null;

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/tickets/${id}`, { status });
      setTickets(tickets.map(t => t._id === id ? { ...t, status } : t));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Tickets</h2>
      {metrics && (
        <div className="mb-4 flex gap-6">
          <div className="bg-blue-100 px-4 py-2 rounded">Total: {metrics.total}</div>
          <div className="bg-green-100 px-4 py-2 rounded">Open: {metrics.open}</div>
          <div className="bg-yellow-100 px-4 py-2 rounded">In Progress: {metrics.inProgress}</div>
          <div className="bg-gray-200 px-4 py-2 rounded">Closed: {metrics.closed}</div>
        </div>
      )}
      <div className="flex gap-4 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded p-2">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="border rounded p-2">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      {filteredTickets.length === 0 ? (
        <div>No tickets found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map(ticket => (
            <div key={ticket._id} className="border rounded p-4 bg-white shadow flex justify-between items-center hover:bg-blue-50">
              <div>
                <Link to={`/ticket/${ticket._id}`} className="font-semibold hover:underline">{ticket.title}</Link>
                <div className="text-sm text-gray-600">Status: {ticket.status} | Priority: {ticket.priority}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Created by: {ticket.createdBy?.name || 'N/A'}</div>
                {/* Employee can update status if assigned */}
                {user && user.role === 'employee' && ticket.assignedTo?._id === user._id && (
                  <select
                    value={ticket.status}
                    onChange={e => handleStatusUpdate(ticket._id, e.target.value)}
                    className="border rounded p-1 ml-4"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 