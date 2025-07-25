import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketRes = await api.get(`/tickets/${id}`);
        setTicket(ticketRes.data);
        const commentsRes = await api.get(`/comments/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Failed to load ticket or comments');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post('/comments', { ticketId: id, content: comment });
      const commentsRes = await api.get(`/comments/${id}`);
      setComments(commentsRes.data);
      setComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!ticket) return <div className="p-8">Ticket not found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{ticket.title}</h2>
      <div className="mb-2">{ticket.description}</div>
      <div className="mb-2 text-sm text-gray-600">Status: {ticket.status} | Priority: {ticket.priority}</div>
      <div className="mb-4 text-xs text-gray-500">Created by: {ticket.createdBy?.name || 'N/A'}</div>
      <hr className="my-4" />
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <div className="mb-4 space-y-2">
        {comments.length === 0 ? (
          <div>No comments yet.</div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="bg-gray-100 p-2 rounded">
              <div className="text-sm">{c.content}</div>
              <div className="text-xs text-gray-500">By: {c.user?.name || 'N/A'} | {new Date(c.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleComment} className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Add a comment..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
      </form>
    </div>
  );
};

export default TicketDetails; 