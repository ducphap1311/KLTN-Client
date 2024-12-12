import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { message } from 'antd';

const Comments = ({ productId, user }) => {
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Number of comments displayed initially
  const [replyParentId, setReplyParentId] = useState(null); // Track the comment being replied to
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://kltn-server.vercel.app/api/v1/product/${productId}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [productId]);

  const onSubmit = async (data) => {
    if (!user) {
      message.warning('You need to log in to comment.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('https://kltn-server.vercel.app/api/v1/comments', {
        productId,
        content: data.content,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComments([res.data, ...comments]);
      reset();
      message.success('Comment added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
      message.error('Failed to add comment. Please try again.');
    }
    setLoading(false);
  };

  const onReplySubmit = async (data) => {
    if (!user) {
      message.warning('You need to log in to reply.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://kltn-server.vercel.app/api/v1/comments/reply', {
        productId,
        content: data.content,
        parentId: replyParentId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setComments([res.data, ...comments]);
      setReplyParentId(null); // Reset reply form
      reset();
      message.success('Reply added successfully!');
    } catch (err) {
      console.error(err);
      message.error('Failed to add reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!user) {
      message.warning('You need to log in to delete comments.');
      return;
    }

    try {
      await axios.delete(`https://kltn-server.vercel.app/api/v1/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
      message.success('Comment deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      message.error('Failed to delete comment. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('').toUpperCase();
  };

  const handleShowMore = () => {
    if (visibleCount >= comments.length) {
      setVisibleCount(5);
    } else {
      setVisibleCount(visibleCount + 5);
    }
  };

  const renderReplies = (parentId) => {
  const replies = comments.filter((comment) => comment.parentId === parentId);

  // Sort replies by date (oldest to newest)
  const sortedReplies = replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return sortedReplies.map((reply) => (
    <div key={reply._id} className="ml-8 mt-4 border-l pl-4">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          {getInitials(reply.user?.username || 'User')}
        </div>
        <div>
          <p className="font-semibold">{reply.user?.username || 'Anonymous'}</p>
          <span className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
          <p className="mt-2">{reply.content}</p>
        </div>
      </div>
    </div>
  ));
};


  const renderComments = () => {
    const parentComments = comments.filter((comment) => !comment.parentId);
    return parentComments.map((comment) => (
      <div key={comment._id} className="mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
            {getInitials(comment.user?.username || 'User')}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{comment.user?.username || localStorage.getItem("username") || 'Anonymous'}</p>
            <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            <p className="mt-2">{comment.content}</p>
            <button
              onClick={() => setReplyParentId(comment._id)}
              className="text-sm text-blue-500 hover:underline"
            >
              Reply
            </button>
            {user && user.id === comment.user?._id && (
              <button
                onClick={() => deleteComment(comment._id)}
                className="ml-4 text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        {renderReplies(comment._id)}
      </div>
    ));
  };

  return (
    <div className="comments-section p-4 bg-gray-100 max-w-[1200px] mx-auto rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Comments</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <textarea
          {...register('content', { required: true })}
          placeholder="Write your comment..."
          rows="4"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        {errors.content && <span className="text-red-500 text-sm">The comment content is required.</span>}
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>

      {/* Reply Form */}
      {replyParentId && (
        <form onSubmit={handleSubmit(onReplySubmit)} className="mb-6 ml-8">
          <textarea
            {...register('content', { required: true })}
            placeholder="Write your reply..."
            rows="3"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? 'Replying...' : 'Reply'}
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="comments-list space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          renderComments()
        )}
      </div>

      {/* Show More/Collapse Button */}
      {comments.length > 5 && (
        <button
          onClick={handleShowMore}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          {visibleCount >= comments.length ? 'Collapse' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default Comments;
